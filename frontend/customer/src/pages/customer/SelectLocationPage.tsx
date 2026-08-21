import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, ChevronRight, Store, X, LocateFixed, AlertTriangle, Truck, ShoppingBag, RotateCcw, Loader2 } from 'lucide-react';
import { Branch } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../api/client';

export type LocationResolutionState =
  | 'IDLE'
  | 'RESOLVING'
  | 'OUTLET_RESOLVED'
  | 'OUTSIDE_RADIUS'
  | 'NO_ELIGIBLE_OUTLET'
  | 'LOCATION_ERROR'
  | 'OUTLET_ERROR';

export const SelectLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setSelectedBranch,
    selectedBranch: storeBranch,
    setOrderType,
    orderType: storeOrderType,
    userCoords: storeCoords
  } = useCartStore();

  const [branches, setBranches] = useState<Branch[]>([]);
  
  // Tripartite branch state: recommended, manual override, and active
  const [recommendedBranch, setRecommendedBranch] = useState<Branch | null>(null);
  const [manualOverrideBranch, setManualOverrideBranch] = useState<Branch | null>(storeBranch);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [isDeliveryEligible, setIsDeliveryEligible] = useState<boolean>(false);
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'COLLECTION'>(storeOrderType || 'COLLECTION');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(storeCoords);

  // Explicit Location Resolution State Machine
  const [resolutionState, setResolutionState] = useState<LocationResolutionState>(
    storeBranch ? (storeCoords ? 'OUTLET_RESOLVED' : 'IDLE') : 'IDLE'
  );

  // Request cancellation and race condition tracking (latest request wins)
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Client-side in-memory geocode cache (normalized postcode -> { lat, lng })
  // Process/Session optimization, zero customer PII
  const clientGeocodeCache = useRef<Map<string, { lat: number; lng: number }>>(new Map());

  // Location Toggle & Error States
  const [locationToggle, setLocationToggle] = useState<boolean>(Boolean(storeCoords));
  const [locationErrorTitle, setLocationErrorTitle] = useState<string>('');
  const [locationErrorDetails, setLocationErrorDetails] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const calculateHaversineMiles = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Active branch derived strictly from explicit customer choice or system recommendation.
  // NO arbitrary branches[0] fallback!
  const activeBranch: Branch | null = manualOverrideBranch ?? recommendedBranch ?? null;

  // Calculate distance for the currently active branch
  const displayedDistance: number | null = activeBranch
    ? (activeBranch.id === recommendedBranch?.id
        ? distanceMiles
        : (userCoords && activeBranch.latitude !== undefined && activeBranch.longitude !== undefined
            ? Math.round(calculateHaversineMiles(userCoords.lat, userCoords.lng, activeBranch.latitude, activeBranch.longitude) * 100) / 100
            : null))
    : null;

  // Check if active manual override is valid for delivery
  const isManualOverrideDeliveryEligible = Boolean(
    activeBranch &&
    activeBranch.delivery_enabled &&
    displayedDistance !== null &&
    displayedDistance <= 2.0
  );

  const checkEligibilityWithBackend = useCallback(async (
    lat?: number,
    lng?: number,
    pc?: string,
    branchList?: Branch[]
  ) => {
    const currentRequestId = ++requestIdRef.current;
    
    // Cancel any ongoing in-flight HTTP request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setResolutionState('RESOLVING');
    setLocationErrorTitle('');
    setLocationErrorDetails('');

    if (lat !== undefined && lng !== undefined) {
      setUserCoords({ lat, lng });
    }

    const cleanPc = pc ? pc.trim().toUpperCase().replace(/\s+/g, '') : undefined;

    try {
      const res: any = await api.post('/branches/nearest', {
        latitude: lat,
        longitude: lng,
        postcode: cleanPc,
        fulfillment_method: fulfillmentType
      }, {
        signal: abortController.signal
      });

      if (currentRequestId !== requestIdRef.current) return;

      const dist = res.distance_miles !== null && res.distance_miles !== undefined ? Number(res.distance_miles) : null;
      const eligible = Boolean(res.delivery_available ?? res.is_delivery_eligible ?? (dist !== null && dist <= 2.0));
      const effNearest = res.nearest_branch || res.assigned_branch || null;
      const assigned = res.assigned_branch || effNearest;

      setIsDeliveryEligible(eligible);
      setDistanceMiles(dist);
      setNearestBranch(effNearest);
      setRecommendedBranch(assigned);
      
      // Clear manual override so fresh geographic location recommendation takes effect
      setManualOverrideBranch(null);

      if (eligible && assigned) {
        setResolutionState('OUTLET_RESOLVED');
        setFulfillmentType('DELIVERY');
      } else if (effNearest) {
        setResolutionState('OUTSIDE_RADIUS');
        setFulfillmentType('COLLECTION');
      } else {
        setResolutionState('NO_ELIGIBLE_OUTLET');
        setFulfillmentType('COLLECTION');
      }
    } catch (err: any) {
      if (currentRequestId !== requestIdRef.current) return;
      if (err?.name === 'AbortError' || err?.name === 'CanceledError') return;

      // Fail closed: No arbitrary branch fallback
      setIsDeliveryEligible(false);
      setRecommendedBranch(null);
      setNearestBranch(null);
      setDistanceMiles(null);
      setResolutionState('OUTLET_ERROR');
      setLocationErrorTitle('Unable to verify delivery availability.');
      setLocationErrorDetails('Our server could not resolve your nearest outlet. Please select a store from the list or try again.');
    }
  }, [fulfillmentType]);

  const requestBrowserLocation = useCallback((branchList?: Branch[]) => {
    const list = branchList || branches;

    if (!('geolocation' in navigator)) {
      setLocationToggle(false);
      setResolutionState('LOCATION_ERROR');
      setLocationErrorTitle('Geolocation is not supported by your browser.');
      setLocationErrorDetails('Please enter your UK postcode below or select Collection.');
      setIsDeliveryEligible(false);
      setFulfillmentType('COLLECTION');
      return;
    }

    setResolutionState('RESOLVING');
    setLocationErrorTitle('');
    setLocationErrorDetails('');

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (
          userLat === undefined || userLng === undefined ||
          isNaN(userLat) || isNaN(userLng) ||
          userLat < -90 || userLat > 90 ||
          userLng < -180 || userLng > 180
        ) {
          setLocationToggle(false);
          setResolutionState('LOCATION_ERROR');
          setLocationErrorTitle('Invalid coordinates received from device.');
          setLocationErrorDetails('Please search with your UK postcode below or select Collection.');
          setIsDeliveryEligible(false);
          setFulfillmentType('COLLECTION');
          return;
        }

        if (accuracy && accuracy > 5000) {
          setLocationToggle(false);
          setResolutionState('LOCATION_ERROR');
          setLocationErrorTitle('Location accuracy is too low to verify 2-mile delivery eligibility.');
          setLocationErrorDetails(
            `Device accuracy is approximately ±${Math.round(accuracy / 1000)} km. Please enter your exact UK postcode for delivery verification.`
          );
          setIsDeliveryEligible(false);
          setFulfillmentType('COLLECTION');
          return;
        }

        setLocationToggle(true);
        setUserCoords({ lat: userLat, lng: userLng, accuracy });
        checkEligibilityWithBackend(userLat, userLng, undefined, list);
      },
      (error) => {
        setLocationToggle(false);
        setIsDeliveryEligible(false);
        setFulfillmentType('COLLECTION');
        setResolutionState('LOCATION_ERROR');

        switch (error.code) {
          case 1:
            setLocationErrorTitle('Location access is required to check delivery availability.');
            setLocationErrorDetails(
              'Please enable location access in your browser settings, or choose Collection from your nearest store.'
            );
            break;
          case 2:
            setLocationErrorTitle('Unable to determine your device location.');
            setLocationErrorDetails(
              'Your browser or device could not retrieve GPS coordinates. Please search with your UK postcode below or choose Collection.'
            );
            break;
          case 3:
            setLocationErrorTitle('Location request timed out.');
            setLocationErrorDetails(
              'The location check took too long to respond. Please tap Retry or enter your postcode manually.'
            );
            break;
          default:
            setLocationErrorTitle('Location access error.');
            setLocationErrorDetails('Please enter your UK postcode below or select Collection.');
            break;
        }
      },
      geoOptions
    );
  }, [branches, checkEligibilityWithBackend]);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await api.get<Branch[]>('/branches');
      if (data && data.length > 0) {
        setBranches(data);
        if (storeCoords) {
          checkEligibilityWithBackend(storeCoords.lat, storeCoords.lng, undefined, data);
        }
      } else {
        setBranches([]);
        setResolutionState('NO_ELIGIBLE_OUTLET');
      }
    } catch {
      setBranches([]);
      setResolutionState('OUTLET_ERROR');
    }
  }, [storeCoords, checkEligibilityWithBackend]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleToggleLocation = () => {
    if (resolutionState === 'RESOLVING') return;
    if (!locationToggle) {
      setManualOverrideBranch(null);
      requestBrowserLocation(branches);
    } else {
      setLocationToggle(false);
      setUserCoords(null);
      setIsDeliveryEligible(false);
      setDistanceMiles(null);
      setRecommendedBranch(null);
      setFulfillmentType('COLLECTION');
      setResolutionState('IDLE');
      setLocationErrorTitle('');
      setLocationErrorDetails('');
    }
  };

  const handleSearchSubmit = () => {
    const raw = searchQuery.trim();
    if (!raw) return;
    setLocationErrorTitle('');
    setLocationErrorDetails('');
    setManualOverrideBranch(null);
    checkEligibilityWithBackend(undefined, undefined, raw, branches);
  };

  const handleSelectDelivery = () => {
    // Re-verify eligibility for active branch
    if (manualOverrideBranch) {
      if (!isManualOverrideDeliveryEligible) return;
    } else {
      if (!isDeliveryEligible || (distanceMiles !== null && distanceMiles > 2.0)) return;
    }
    setFulfillmentType('DELIVERY');
  };

  const handleSelectCollection = (branchToUse?: Branch) => {
    setFulfillmentType('COLLECTION');
    if (branchToUse) {
      setManualOverrideBranch(branchToUse);
      setResolutionState('OUTLET_RESOLVED');
    }
  };

  const handleConfirmLocation = () => {
    if (!activeBranch) return;

    const isTargetRecommended = !manualOverrideBranch || manualOverrideBranch.id === recommendedBranch?.id;
    const isEligible = isTargetRecommended
      ? (isDeliveryEligible && distanceMiles !== null && distanceMiles <= 2.0)
      : isManualOverrideDeliveryEligible;

    const finalOrderType = fulfillmentType === 'DELIVERY' && isEligible ? 'DELIVERY' : 'COLLECTION';
    const finalDist = displayedDistance;

    setSelectedBranch(
      activeBranch,
      finalDist,
      isEligible,
      nearestBranch || activeBranch,
      isEligible ? null : 'WE PROVIDE DELIVERY UP TO 2 MILES ONLY',
      userCoords,
      searchQuery || undefined
    );

    setOrderType(finalOrderType);

    try {
      localStorage.setItem('patty_selected_branch', JSON.stringify(activeBranch));
    } catch {}

    navigate('/order');
  };

  const hasActiveBranches = branches.length > 0;
  const isResolving = resolutionState === 'RESOLVING';

  return (
    <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20 text-[#F5F5F5]">
      {/* Page Heading & Subtitle */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">
          Select location
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-2 font-normal">
          Find your nearest Patty Project outlet & check delivery eligibility (up to 2 miles).
        </p>
      </div>

      {/* STATE: NO ACTIVE BRANCHES */}
      {resolutionState === 'NO_ELIGIBLE_OUTLET' && (
        <div className="bg-[#1C0E07] border border-[#6B2A0D] rounded-xl p-6 text-center space-y-3 mb-8">
          <AlertTriangle className="w-8 h-8 text-[#FF5500] mx-auto" />
          <h2 className="text-lg font-bold text-white">No Active Stores Currently Available</h2>
          <p className="text-xs text-[#D1D5DB]">
            Our outlets are currently unavailable for online ordering. Please check back shortly.
          </p>
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      {resolutionState !== 'NO_ELIGIBLE_OUTLET' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
          {/* LEFT COLUMN: Current Location Action, Postcode Search & Fulfillment Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Use your current location Card */}
            <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 flex items-center justify-between gap-4 transition-colors hover:border-[#333333]">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                  locationToggle && (resolutionState === 'OUTLET_RESOLVED' || resolutionState === 'OUTSIDE_RADIUS')
                    ? 'bg-[#FF5500]/10 border-[#FF5500]/30 text-[#FF5500]'
                    : 'bg-[#151515] border-[#242424] text-[#A1A1AA]'
                }`}>
                  {isResolving ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#FF5500]" />
                  ) : (
                    <LocateFixed className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-[#F5F5F5] truncate">
                    Use your current location
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5 font-normal leading-tight">
                    Allow location access to check 2-mile delivery radius
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={handleToggleLocation}
                disabled={isResolving}
                type="button"
                aria-label="Toggle location detection"
                className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50 ${
                  locationToggle && (resolutionState === 'OUTLET_RESOLVED' || resolutionState === 'OUTSIDE_RADIUS')
                    ? 'bg-[#FF5500]'
                    : 'bg-[#242424]'
                } ${isResolving ? 'opacity-60 cursor-wait' : ''}`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                    locationToggle && (resolutionState === 'OUTLET_RESOLVED' || resolutionState === 'OUTSIDE_RADIUS')
                      ? 'translate-x-4'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Location Error Message */}
            {locationErrorTitle && (
              <div className="bg-[#2A1215] border border-[#EF4444]/30 p-3.5 rounded-lg text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-[#FCA5A5] leading-snug">{locationErrorTitle}</p>
                    {locationErrorDetails && (
                      <p className="text-[11px] text-[#F87171] leading-relaxed">{locationErrorDetails}</p>
                    )}
                  </div>
                </div>
                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    onClick={() => requestBrowserLocation(branches)}
                    disabled={isResolving}
                    className="px-3 py-1.5 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-[#FCA5A5] rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isResolving ? 'Checking...' : 'Retry Location Check'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* OR Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-[1px] bg-[#242424] flex-1" />
              <span className="text-xs font-medium text-[#71717A] uppercase tracking-wider">OR</span>
              <div className="h-[1px] bg-[#242424] flex-1" />
            </div>

            {/* Location Search Input & Action Button */}
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-11 bg-[#151515] border border-[#242424] focus-within:border-[#FF5500] rounded-lg px-3.5 flex items-center gap-2.5 transition-colors">
                <Search className="w-4 h-4 text-[#71717A] shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your location or postcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  className="bg-transparent text-sm text-[#F5F5F5] placeholder-[#71717A] focus:outline-none w-full font-normal"
                />
              </div>

              <button
                onClick={handleSearchSubmit}
                disabled={isResolving}
                title="Search location"
                aria-label="Search location"
                className="h-11 w-11 bg-[#151515] border border-[#242424] hover:border-[#FF5500] hover:bg-[#FF5500]/10 rounded-lg flex items-center justify-center text-[#FF5500] shrink-0 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50 disabled:opacity-50"
              >
                {isResolving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF5500]" />
                ) : (
                  <Navigation className="w-4 h-4 transform rotate-45" />
                )}
              </button>
            </div>

            {/* Fulfillment Method Selection Cards (Delivery vs Collection) */}
            <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 space-y-4">
              <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                Choose Fulfillment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. DELIVERY OPTION */}
                <div
                  onClick={handleSelectDelivery}
                  aria-disabled={!isDeliveryEligible && !isManualOverrideDeliveryEligible}
                  className={`p-4 rounded-lg border transition-all select-none ${
                    (isDeliveryEligible || isManualOverrideDeliveryEligible)
                      ? fulfillmentType === 'DELIVERY'
                        ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5] cursor-pointer ring-1 ring-[#FF5500]/40'
                        : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333] cursor-pointer'
                      : 'bg-[#121212]/60 border-[#222222] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        (isDeliveryEligible || isManualOverrideDeliveryEligible)
                          ? 'bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500]'
                          : 'bg-[#1A1A1A] text-[#71717A]'
                      }`}>
                        <Truck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#F5F5F5]">Delivery</p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          {(isDeliveryEligible || isManualOverrideDeliveryEligible) ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      fulfillmentType === 'DELIVERY' && (isDeliveryEligible || isManualOverrideDeliveryEligible)
                        ? 'border-[#FF5500]'
                        : 'border-[#242424]'
                    }`}>
                      {fulfillmentType === 'DELIVERY' && (isDeliveryEligible || isManualOverrideDeliveryEligible) && (
                        <div className="w-2 h-2 rounded-full bg-[#FF5500]" />
                      )}
                    </div>
                  </div>

                  {!isDeliveryEligible && !isManualOverrideDeliveryEligible && (
                    <div className="mt-2.5 pt-2 border-t border-[#222222]">
                      <span className="text-[10px] font-extrabold text-[#FF5500] uppercase tracking-wider block">
                        WE PROVIDE DELIVERY UP TO 2 MILES ONLY
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. COLLECTION OPTION */}
                <div
                  onClick={() => handleSelectCollection()}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    fulfillmentType === 'COLLECTION'
                      ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5] ring-1 ring-[#FF5500]/40'
                      : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0">
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#F5F5F5]">Collection</p>
                        <p className="text-[11px] text-[#22C55E] font-medium">Available</p>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      fulfillmentType === 'COLLECTION' ? 'border-[#FF5500]' : 'border-[#242424]'
                    }`}>
                      {fulfillmentType === 'COLLECTION' && <div className="w-2 h-2 rounded-full bg-[#FF5500]" />}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#222222]">
                    <span className="text-[10px] text-[#A1A1AA] block">
                      Store pickup from outlet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Nearest Outlet Card & Outside 2-Mile Recommendation */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Outside 2-Mile Delivery Radius Notice Banner */}
            {resolutionState === 'OUTSIDE_RADIUS' && nearestBranch && (
              <div className="bg-[#1C0E07] border border-[#6B2A0D] rounded-xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-[#FF5500] font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>WE PROVIDE DELIVERY UP TO 2 MILES ONLY</span>
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  Please collect your food from the nearest store.
                </p>

                <div className="pt-3 border-t border-[#6B2A0D]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">Nearest store:</span>
                    <p className="text-sm font-bold text-white">Patty Project — {nearestBranch.name}</p>
                    {distanceMiles !== null && (
                      <p className="text-xs text-[#FF5500] font-semibold mt-0.5">{distanceMiles} miles away</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectCollection(nearestBranch)}
                    className="px-4 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>COLLECT FROM THIS STORE</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl p-6 space-y-5">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#151515] border border-[#242424] flex items-center justify-center text-[#FF5500]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#F5F5F5]">
                    Selected outlet
                  </h2>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs font-medium text-[#FF5500] hover:text-[#E84F00] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Select from list</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {isResolving ? (
                <div className="p-8 bg-[#121212] border border-[#242424] rounded-lg text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF5500] mx-auto" />
                  <p className="text-xs text-[#A1A1AA]">Finding nearest outlet & verifying delivery radius...</p>
                </div>
              ) : activeBranch ? (
                /* Selected Outlet Card Surface */
                <div className="bg-[#140B06] border border-[#6B2A0D] rounded-lg p-5 transition-all space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Store Icon & Details */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-lg font-semibold text-[#F5F5F5] truncate">
                          {activeBranch.name}
                        </h3>
                        <p className="text-sm text-[#A1A1AA] leading-snug">
                          {activeBranch.address_line1}
                        </p>
                        <p className="text-xs text-[#71717A]">
                          {activeBranch.city}, {activeBranch.postcode}
                        </p>
                        {activeBranch.phone && (
                          <p className="text-xs text-[#A1A1AA] pt-0.5">
                            Tel: {activeBranch.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Distance Readout in Miles */}
                    {displayedDistance !== null && (
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-[#FF5500]">
                          {displayedDistance} miles
                        </p>
                        <span className="text-[11px] text-[#71717A] font-medium block">
                          Distance
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Open Status & Operating Hours */}
                  <div className="flex items-center gap-2.5 bg-[#050505] border border-[#242424] rounded-lg p-3">
                    <div className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                    <span className="text-xs font-semibold text-[#22C55E]">
                      Open now
                    </span>
                    <span className="text-xs text-[#71717A]">•</span>
                    <span className="text-xs text-[#A1A1AA] font-normal">
                      10:00 AM – 11:00 PM
                    </span>
                  </div>
                </div>
              ) : (
                /* IDLE / NO SELECTION STATE - No arbitrary branches[0] */
                <div className="p-8 bg-[#121212] border border-[#242424] rounded-lg text-center space-y-2 text-[#A1A1AA]">
                  <MapPin className="w-6 h-6 text-[#71717A] mx-auto mb-1" />
                  <p className="text-sm font-semibold text-[#F5F5F5]">No Outlet Selected</p>
                  <p className="text-xs">
                    Please allow location access above, search your UK postcode, or select an outlet from the list.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM LOCATION Full-Width Primary CTA Button */}
      {resolutionState !== 'NO_ELIGIBLE_OUTLET' && (
        <button
          onClick={handleConfirmLocation}
          disabled={!activeBranch || isResolving}
          className="w-full h-12 bg-[#FF5500] hover:bg-[#E84F00] text-white text-sm font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50"
        >
          <MapPin className="w-4 h-4" />
          <span>
            {!activeBranch
              ? 'Please Select a Location or Store to Continue'
              : fulfillmentType === 'DELIVERY' && (isDeliveryEligible || isManualOverrideDeliveryEligible)
                ? 'Confirm Delivery Location & View Menu'
                : 'Confirm Store for Collection & View Menu'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Select Outlet Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl p-6 max-w-lg w-full space-y-5 text-[#F5F5F5] shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-base font-semibold">Select Outlet Branch</h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="text-[#A1A1AA] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {branches.map((b) => {
                const isSelected = activeBranch?.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setManualOverrideBranch(b);
                      setResolutionState('OUTLET_RESOLVED');
                      setShowModal(false);
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#140B06] border-[#6B2A0D] text-[#F5F5F5]'
                        : 'bg-[#121212] border-[#242424] text-[#A1A1AA] hover:border-[#333333] hover:text-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FF5A00] text-white' : 'bg-[#151515] border border-[#242424] text-[#A1A1AA]'
                      }`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#F5F5F5]">{b.name}</p>
                        <p className="text-xs text-[#A1A1AA]">{b.address_line1}, {b.city} ({b.postcode})</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-xs font-semibold text-[#FF5A00] bg-[#FF5A00]/10 border border-[#6B2A0D] px-2.5 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
