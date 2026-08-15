import React, { useState } from 'react';
import { X, MapPin, Search, Navigation, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';
import { useCartStore } from '../../store/cartStore';
import { Branch } from '../../types';

interface Props {
  onClose: () => void;
}

export const LocationModal: React.FC<Props> = ({ onClose }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultBranch, setResultBranch] = useState<Branch | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  const { setSelectedBranch } = useCartStore();

  const handleGeocode = async (lat?: number, lng?: number, pc?: string) => {
    setLoading(true);
    setMsg('');
    try {
      const res: any = await api.post('/branches/nearest', {
        latitude: lat,
        longitude: lng,
        postcode: pc
      });

      if (res.assigned_branch) {
        setResultBranch(res.assigned_branch);
        setDistanceMiles(res.distance_miles);
        setMsg(res.message);
      } else {
        setResultBranch(null);
        setMsg(res.message || 'Location is outside our delivery zone.');
      }
    } catch (err: any) {
      setMsg('Error finding nearest outlet.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLocation = (checked: boolean) => {
    setUseCurrentLocation(checked);
    if (checked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setMsg('Geolocation denied. Please enter UK postcode.');
        }
      );
    }
  };

  const handleConfirm = () => {
    if (resultBranch) {
      setSelectedBranch(resultBranch, distanceMiles || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center relative">
          <img src="/logo.jpeg" alt="Patty Project" className="w-16 h-16 rounded-full object-cover border-2 border-[#FF5500] mb-3" />
          <h2 className="text-xl font-bold text-white">Select location</h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Find the nearest outlet to place your order.</p>
          <button onClick={onClose} className="absolute top-0 right-0 p-1 text-[#9CA3AF] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Current Location Card (Matching Page 2 of Customer PDF) */}
        <div className="bg-[#1A1A1A] border border-[#262626] p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center border border-[#FF5500]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Use your current location</p>
              <p className="text-[10px] text-[#9CA3AF]">Allow location access to find nearest shops</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={(e) => handleToggleLocation(e.target.checked)}
            className="w-5 h-5 rounded bg-[#121212] border-[#262626] accent-[#FF5500] cursor-pointer"
          />
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#262626]"></div></div>
          <span className="relative bg-[#121212] px-3 text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">OR</span>
        </div>

        {/* Postcode Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Enter your location / Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <button
            onClick={() => handleGeocode(undefined, undefined, postcode)}
            className="bg-[#1A1A1A] border border-[#262626] p-2.5 rounded-xl text-[#FF5500] hover:bg-[#262626]"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Nearest Outlet Result Card */}
        {resultBranch && (
          <div className="bg-[#1A1A1A] border border-[#FF5500]/40 p-4 rounded-xl space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5500]/10 text-[#FF5500] font-bold text-sm flex items-center justify-center border border-[#FF5500]/30">
                  {resultBranch.code}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{resultBranch.name}</h4>
                  <p className="text-[10px] text-[#9CA3AF]">{resultBranch.address_line1}, {resultBranch.postcode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">{distanceMiles || 1.2} miles</p>
                <p className="text-[10px] text-[#6B7280]">Distance</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-[#10B981] font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5" /> Open Now (10:00 AM - 11:00 PM)
              </span>
            </div>
          </div>
        )}

        {msg && <p className="text-xs text-center text-[#FF5500] font-medium">{msg}</p>}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!resultBranch || loading}
          className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" />
          <span>Confirm location &gt;</span>
        </button>
      </div>
    </div>
  );
};
