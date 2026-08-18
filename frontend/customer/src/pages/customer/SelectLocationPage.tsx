import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, ChevronRight, Store, X, LocateFixed, AlertTriangle, Truck, ShoppingBag } from 'lucide-react';
import { Branch } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../api/client';

export const SelectLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setSelectedBranch,
    selectedBranch: storeBranch,
    setOrderType,
    userCoords: storeCoords
  } = useCartStore();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Branch | null>(storeBranch);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [isDeliveryEligible, setIsDeliveryEligible] = useState<boolean>(false);
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'COLLECTION'>('COLLECTION');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(storeCoords);

  const [locationToggle, setLocationToggle] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const checkEligibilityWithBackend = useCallback(async (lat?: number, lng?: number, pc?: string, branchList?: Branch[]) => {
    setLoadingLocation(true);
    setLocationError('');

    if (lat !== undefined && lng !== undefined) {
      setUserCoords({ lat, lng });
    }

    try {
      const res: any = await api.post('/branches/nearest', {
        latitude: lat,
        longitude: lng,
        postcode: pc
      });

      const dist = res.distance_miles !== null && res.distance_miles !== undefined ? Number(res.distance_miles) : null;
      const eligible = Boolean(res.is_delivery_eligible ?? (dist !== null && dist <= 2.0));
      const effNearest = res.nearest_branch || res.assigned_branch || null;

      setIsDeliveryEligible(eligible);
      setDistanceMiles(dist);
      setNearestBranch(effNearest);

      if (eligible) {
        setSelectedOutlet((prev) => prev || res.assigned_branch || effNearest);
      } else {
        setSelectedOutlet((prev) => prev || effNearest);
        setFulfillmentType('COLLECTION');
      }
    } catch {
      if (lat !== undefined && lng !== undefined && branchList && branchList.length > 0) {
        let nearest: Branch | null = null;
        let minDistance = Infinity;

        branchList.forEach((b) => {
          const d = calculateHaversineMiles(lat, lng, b.latitude, b.longitude);
          if (d < minDistance) {
            minDistance = d;
            nearest = b;
          }
        });

        const distRounded = Math.round(minDistance * 100) / 100;
        const eligible = distRounded <= 2.0;

        setIsDeliveryEligible(eligible);
        setDistanceMiles(distRounded);
        setNearestBranch(nearest);
        setSelectedOutlet((prev) => prev || nearest);

        if (!eligible) {
          setFulfillmentType('COLLECTION');
        }
      } else {
        setIsDeliveryEligible(false);
        setFulfillmentType('COLLECTION');
        setLocationError('Unable to verify location. Delivery is unavailable. Please select Collection.');
      }
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  const requestBrowserLocation = useCallback((branchList: Branch[]) => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser. Please select Collection.');
      setIsDeliveryEligible(false);
      setFulfillmentType('COLLECTION');
      return;
    }

    setLoadingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        checkEligibilityWithBackend(userLat, userLng, undefined, branchList);
      },
      () => {
        setLoadingLocation(false);
        setIsDeliveryEligible(false);
        setFulfillmentType('COLLECTION');
        setLocationError('Location access is required to check delivery availability. Please enable location access, or choose Collection from your nearest store.');
        if (branchList.length > 0) {
          setSelectedOutlet((prev) => prev || branchList[0]);
          setNearestBranch(branchList[0]);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [checkEligibilityWithBackend]);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await api.get<Branch[]>('/branches');
      if (data && data.length > 0) {
        setBranches(data);
        if (storeCoords) {
          checkEligibilityWithBackend(storeCoords.lat, storeCoords.lng, undefined, data);
        } else if (locationToggle) {
          requestBrowserLocation(data);
        } else {
          setSelectedOutlet((prev) => prev || data[0]);
          setNearestBranch(data[0]);
        }
      } else {
        loadFallbackBranches();
      }
    } catch {
      loadFallbackBranches();
    }
  }, [storeCoords, locationToggle, checkEligibilityWithBackend, requestBrowserLocation]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const loadFallbackBranches = () => {

    const fallback: Branch[] = [
      {
        id: 'branch-1',
        code: 'LC',
        name: 'Patty Project - Camden',
        address_line1: '45 Camden High Street',
        city: 'London',
        postcode: 'NW1 7JE',
        latitude: 51.5360,
        longitude: -0.1420,
        phone: '07417 521128',
        delivery_enabled: true,
        collection_enabled: true,
        ordering_enabled: true,
        delivery_radius_miles: 2.0,
        opening_hours: { monday: { open: '10:00', close: '23:00' } },
        is_active: true
      },
      {
        id: 'branch-2',
        code: 'LW',
        name: 'Patty Project - Westfield',
        address_line1: "Ariel Way, Shepherd's Bush",
        city: 'London',
        postcode: 'W12 7GF',
        latitude: 51.5074,
        longitude: -0.2217,
        phone: '+44 20 8749 8899',
        delivery_enabled: true,
        collection_enabled: true,
        ordering_enabled: true,
        delivery_radius_miles: 3.0,
        opening_hours: { monday: { open: '11:00', close: '22:00' } },
        is_active: true
      }
    ];
    setBranches(fallback);
    if (locationToggle) {
      requestBrowserLocation(fallback);
    } else {
      setSelectedOutlet(fallback[0]);
      setNearestBranch(fallback[0]);
    }
  };

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

  const handleToggleLocation = () => {
    const nextState = !locationToggle;
    setLocationToggle(nextState);
    if (nextState) {
      requestBrowserLocation(branches);
    } else {
      setIsDeliveryEligible(false);
      setFulfillmentType('COLLECTION');
      setLocationError('Location detection disabled. Delivery is unavailable. Please enable location or choose Collection.');
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    checkEligibilityWithBackend(undefined, undefined, searchQuery.trim(), branches);
  };

  const handleSelectDelivery = () => {
    if (!isDeliveryEligible || (distanceMiles !== null && distanceMiles > 2.0)) {
      return;
    }
    setFulfillmentType('DELIVERY');
  };

  const handleSelectCollection = (branchToUse?: Branch) => {
    setFulfillmentType('COLLECTION');
    if (branchToUse) {
      setSelectedOutlet(branchToUse);
    }
  };

  const handleConfirmLocation = () => {
    const targetBranch = selectedOutlet || nearestBranch || (branches.length > 0 ? branches[0] : null);
    if (targetBranch) {
      const isEligible = isDeliveryEligible && distanceMiles !== null && distanceMiles <= 2.0;
      const finalOrderType = fulfillmentType === 'DELIVERY' && isEligible ? 'DELIVERY' : 'COLLECTION';

      setSelectedBranch(
        targetBranch,
        distanceMiles,
        isEligible,
        nearestBranch || targetBranch,
        isEligible ? null : 'WE PROVIDE DELIVERY UP TO 2 MILES ONLY',
        userCoords,
        searchQuery || undefined
      );

      setOrderType(finalOrderType);

      try {
        localStorage.setItem('patty_selected_branch', JSON.stringify(targetBranch));
      } catch {}

      navigate('/order');
    }
  };

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address_line1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-20 text-[#F5F5F5]">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">
          Select location
        </h1>
        <p className="text-sm text-[#A1A1AA] mt-2 font-normal">
          Find your nearest Patty Project outlet & check delivery eligibility (up to 2 miles).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 flex items-center justify-between gap-4 transition-colors hover:border-[#333333]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#151515] border border-[#242424] flex items-center justify-center text-[#FF5500] shrink-0">
                <LocateFixed className="w-5 h-5" />
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

            <button
              onClick={handleToggleLocation}
              type="button"
              aria-label="Toggle location detection"
              className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50 ${
                locationToggle ? 'bg-[#FF5500]' : 'bg-[#242424]'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${
                  locationToggle ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {locationError && (
            <div className="flex items-start gap-2.5 bg-[#2A1215] border border-[#EF4444]/30 p-3.5 rounded-lg text-xs text-[#FCA5A5] font-medium leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
              <span>{locationError}</span>
            </div>
          )}

          <div className="flex items-center gap-4 py-1">
            <div className="h-[1px] bg-[#242424] flex-1" />
            <span className="text-xs font-medium text-[#71717A] uppercase tracking-wider">OR</span>
            <div className="h-[1px] bg-[#242424] flex-1" />
          </div>

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
              title="Search location"
              aria-label="Search location"
              className="h-11 w-11 bg-[#151515] border border-[#242424] hover:border-[#FF5500] hover:bg-[#FF5500]/10 rounded-lg flex items-center justify-center text-[#FF5500] shrink-0 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50"
            >
              <Navigation className="w-4 h-4 transform rotate-45" />
            </button>
          </div>

          <div className="bg-[#0D0D0D] border border-[#242424] rounded-[10px] p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
              Choose Fulfillment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={handleSelectDelivery}
                className={`p-4 rounded-lg border transition-all ${
                  isDeliveryEligible
                    ? fulfillmentType === 'DELIVERY'
                      ? 'bg-[#241209] border-[#6B2A0D] text-[#F5F5F5] cursor-pointer ring-1 ring-[#FF5500]/40'
                      : 'bg-[#151515] border-[#242424] text-[#A1A1AA] hover:border-[#333333] cursor-pointer'
                    : 'bg-[#121212]/60 border-[#222222] opacity-50 cursor-not-allowed select-none'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDeliveryEligible ? 'bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500]' : 'bg-[#1A1A1A] text-[#71717A]'
                    }`}>
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#F5F5F5]">Delivery</p>
                      <p className="text-[11px] text-[#A1A1AA]">
                        {isDeliveryEligible ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    fulfillmentType === 'DELIVERY' && isDeliveryEligible ? 'border-[#FF5500]' : 'border-[#242424]'
                  }`}>
                    {fulfillmentType === 'DELIVERY' && isDeliveryEligible && <div className="w-2 h-2 rounded-full bg-[#FF5500]" />}
                  </div>
                </div>

                {!isDeliveryEligible && (
                  <div className="mt-2.5 pt-2 border-t border-[#222222]">
                    <span className="text-[10px] font-extrabold text-[#FF5500] uppercase tracking-wider block">
                      WE PROVIDE DELIVERY UP TO 2 MILES ONLY
                    </span>
                  </div>
                )}
              </div>

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

        <div className="lg:col-span-7 space-y-4">
          {!isDeliveryEligible && (
            <div className="bg-[#1C0E07] border border-[#6B2A0D] rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-[#FF5500] font-black text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>WE PROVIDE DELIVERY UP TO 2 MILES ONLY</span>
              </div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                Please collect your food from the nearest store.
              </p>

              {nearestBranch && (
                <div className="pt-3 border-t border-[#6B2A0D]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">Nearest store</span>
                    <p className="text-sm font-bold text-white">Patty Project — {nearestBranch.name}</p>
                    {distanceMiles !== null && (
                      <p className="text-xs text-[#FF5500] font-semibold mt-0.5">{distanceMiles} miles away</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectCollection(nearestBranch)}
                    className="px-4 py-2.5 bg-[#FF5500] hover:bg-[#E04B00] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>COLLECT FROM THIS STORE</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl p-6 space-y-5">
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

            {loadingLocation ? (
              <div className="p-8 bg-[#121212] border border-[#242424] rounded-lg text-center text-xs text-[#A1A1AA]">
                Finding nearest outlet & verifying delivery radius...
              </div>
            ) : selectedOutlet ? (
              <div className="bg-[#140B06] border border-[#6B2A0D] rounded-lg p-5 transition-all space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-lg font-semibold text-[#F5F5F5] truncate">
                        {selectedOutlet.name}
                      </h3>
                      <p className="text-sm text-[#A1A1AA] leading-snug">
                        {selectedOutlet.address_line1}
                      </p>
                      <p className="text-xs text-[#71717A]">
                        {selectedOutlet.city}, {selectedOutlet.postcode}
                      </p>
                      {selectedOutlet.phone && (
                        <p className="text-xs text-[#A1A1AA] pt-0.5">
                          Tel: {selectedOutlet.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {distanceMiles !== null && (
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-[#FF5500]">
                        {distanceMiles} miles
                      </p>
                      <span className="text-[11px] text-[#71717A] font-medium block">
                        Distance
                      </span>
                    </div>
                  )}
                </div>

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
              <div className="p-8 bg-[#121212] border border-[#242424] rounded-lg text-center text-xs text-[#A1A1AA]">
                No outlet selected. Please pick from list.
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmLocation}
        disabled={!selectedOutlet && !nearestBranch}
        className="w-full h-12 bg-[#FF5500] hover:bg-[#E84F00] text-white text-sm font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5500]/50"
      >
        <MapPin className="w-4 h-4" />
        <span>
          {fulfillmentType === 'DELIVERY' && isDeliveryEligible
            ? 'Confirm Delivery Location & View Menu'
            : 'Confirm Store for Collection & View Menu'}
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>

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
                const isSelected = selectedOutlet?.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedOutlet(b);
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
