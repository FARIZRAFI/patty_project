import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, Clock, ChevronRight, Store, X, Headphones, Phone } from 'lucide-react';
import { Branch } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { api } from '../../api/client';

export const SelectLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedBranch, selectedBranch: storeBranch } = useCartStore();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Branch | null>(null);
  const [distanceReadout, setDistanceReadout] = useState<string>('8.72 km');
  const [locationToggle, setLocationToggle] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await api.get<Branch[]>('/branches');
      if (data && data.length > 0) {
        setBranches(data);
        autoSelectNearest(data);
      } else {
        useFallbackBranches();
      }
    } catch (err) {
      useFallbackBranches();
    }
  };

  const useFallbackBranches = () => {
    const fallback: Branch[] = [
      {
        id: 'branch-1',
        code: 'LC',
        name: 'Patty Project',
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
    autoSelectNearest(fallback);
  };

  const autoSelectNearest = (branchList: Branch[]) => {
    if (storeBranch) {
      setSelectedOutlet(storeBranch);
      return;
    }

    if ('geolocation' in navigator && locationToggle) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          let nearest: Branch | null = null;
          let minDistance = Infinity;

          branchList.forEach((b) => {
            const dist = calculateHaversineKm(userLat, userLng, b.latitude, b.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = b;
            }
          });

          if (nearest) {
            setSelectedOutlet(nearest);
            setDistanceReadout(`${minDistance.toFixed(2)} km`);
          } else {
            setSelectedOutlet(branchList[0]);
            setDistanceReadout('8.72 km');
          }
          setLoadingLocation(false);
        },
        () => {
          setLocationError('Location permission denied. Defaulting to nearest shop.');
          setSelectedOutlet(branchList[0]);
          setDistanceReadout('8.72 km');
          setLoadingLocation(false);
        },
        { timeout: 8000 }
      );
    } else {
      setSelectedOutlet(branchList[0]);
      setDistanceReadout('8.72 km');
    }
  };

  const calculateHaversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
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
    if (nextState && branches.length > 0) {
      autoSelectNearest(branches);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedOutlet) {
      const distVal = parseFloat(distanceReadout) || 2.0;
      setSelectedBranch(selectedOutlet, distVal * 0.621371); // convert to miles
      try {
        localStorage.setItem('patty_selected_branch', JSON.stringify(selectedOutlet));
      } catch (e) {}
      navigate('/menu');
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
    <div className="w-full max-w-[1450px] mx-auto px-6 sm:px-10 lg:px-12 py-8 pb-24 text-white">
      {/* Page Title & Subtitle matching Screenshot 2 */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white font-hero tracking-tight">
          Select location
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1.5 font-medium">
          Find the nearest outlet to place your order.
        </p>
      </div>

      {/* 2-Column Desktop Grid (~48% Left / ~52% Right) matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* LEFT COLUMN: Current Location Toggle & Search Bar */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Use your current location */}
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0 shadow-inner">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                  Use your current location
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5 font-medium leading-tight">
                  Allow location access to find nearest shops
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleLocation}
              type="button"
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                locationToggle ? 'bg-[#FF5500]' : 'bg-[#222222]'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  locationToggle ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {locationError && (
            <p className="text-xs text-[#FF5500] font-semibold pl-2">{locationError}</p>
          )}

          {/* OR Divider matching Screenshot 2 */}
          <div className="flex items-center gap-4 py-1">
            <div className="h-[1px] bg-[#1C1C1C] flex-1" />
            <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase">OR</span>
            <div className="h-[1px] bg-[#1C1C1C] flex-1" />
          </div>

          {/* Search Bar matching Screenshot 2 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#0D0D0D] border border-[#1F1F1F] focus-within:border-[#FF5500]/50 rounded-2xl py-3.5 px-4 flex items-center gap-3 shadow-xl transition-all">
              <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              <input
                type="text"
                placeholder="Enter your location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-[#6B7280] focus:outline-none w-full font-medium"
              />
            </div>

            <button
              onClick={() => {
                if (filteredBranches.length > 0) {
                  setSelectedOutlet(filteredBranches[0]);
                }
              }}
              title="Search Location"
              className="w-12 h-12 bg-[#0D0D0D] border border-[#1F1F1F] hover:border-[#FF5500]/50 rounded-2xl flex items-center justify-center text-[#FF5500] hover:bg-[#FF5500]/10 shrink-0 cursor-pointer shadow-xl transition-all"
            >
              <Navigation className="w-5 h-5 transform rotate-45" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Nearest Outlet Card matching Screenshot 2 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF5500]" />
                <h2 className="text-base sm:text-lg font-black text-white font-hero">
                  Your nearest outlet
                </h2>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Select from list</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loadingLocation ? (
              <div className="p-8 bg-[#141414] border border-[#222222] rounded-2xl text-center text-xs text-[#9CA3AF]">
                Finding nearest outlet...
              </div>
            ) : selectedOutlet ? (
              /* Outlet Card matching Screenshot 2 */
              <div className="bg-[#141414] border-2 border-[#FF5500] rounded-2xl p-5 sm:p-6 transition-all shadow-xl shadow-[#FF5500]/10">
                <div className="flex items-start justify-between gap-4">
                  {/* Store Icon & Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-full border border-[#FF5500]/50 bg-[#FF5500]/10 flex items-center justify-center text-[#FF5500] shrink-0 mt-0.5">
                      <Store className="w-7 h-7" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-lg sm:text-xl font-extrabold text-white truncate">
                        {selectedOutlet.name}
                      </h3>
                      <p className="text-xs text-[#D1D5DB] font-medium leading-snug">
                        {selectedOutlet.address_line1}
                      </p>
                      <p className="text-xs text-[#9CA3AF] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                        <span>{selectedOutlet.city}, {selectedOutlet.postcode}</span>
                      </p>
                    </div>
                  </div>

                  {/* Distance Readout */}
                  <div className="text-right shrink-0">
                    <p className="text-lg sm:text-xl font-black text-white">
                      {distanceReadout}
                    </p>
                    <span className="text-[10px] text-[#6B7280] font-bold block uppercase tracking-wider">
                      Distance
                    </span>
                  </div>
                </div>

                {/* Status & Operating Hours Box */}
                <div className="flex items-center gap-3 bg-[#0A0A0A] border border-[#222222] rounded-xl p-3.5 mt-5">
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#10B981] block">
                      Open Now
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] font-medium">
                      10:00 AM – 11:00 PM
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#141414] border border-[#222222] rounded-2xl text-center text-xs text-[#9CA3AF]">
                No outlet selected. Please pick from list.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM LOCATION Full-Width CTA Button matching Screenshot 2 */}
      <button
        onClick={handleConfirmLocation}
        disabled={!selectedOutlet}
        className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white text-sm font-black uppercase tracking-wider py-4 rounded-2xl shadow-2xl shadow-[#FF5500]/30 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mb-16"
      >
        <MapPin className="w-5 h-5 fill-white text-[#FF5500]" />
        <span>Confirm location</span>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Manual Outlet Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#1F1F1F] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-white shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-lg font-black font-hero">Select Outlet Branch</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {branches.map((b) => {
                const isSelected = selectedOutlet?.id === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedOutlet(b);
                      setShowModal(false);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#FF5500]/10 border-[#FF5500] text-white'
                        : 'bg-[#141414] border-[#222222] text-[#9CA3AF] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FF5500] text-white' : 'bg-[#222222] text-[#9CA3AF]'
                      }`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-white">{b.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{b.address_line1}, {b.city} ({b.postcode})</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-xs font-bold text-[#FF5500] bg-[#FF5500]/20 px-2.5 py-1 rounded-lg">
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

      {/* Contact / Info Footer Bar matching Screenshot 2 */}
      <div className="border-t border-[#1A1A1A] pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#222222] bg-[#0D0D0D] flex items-center justify-center text-[#9CA3AF] shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Need help?</p>
              <p className="mt-0.5">hellofoodychefs@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#222222] bg-[#0D0D0D] flex items-center justify-center text-[#9CA3AF] shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Open Daily</p>
              <p className="mt-0.5">11:00 AM – 11:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#222222] bg-[#0D0D0D] flex items-center justify-center text-[#9CA3AF] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">07417 521128</p>
              <p className="mt-0.5">Call us anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
