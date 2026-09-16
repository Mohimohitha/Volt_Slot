import { useState, useEffect } from 'react';
import { 
  Zap, 
  BatteryCharging, 
  Leaf, 
  ShieldCheck, 
  Car, 
  CalendarCheck, 
  MapPin, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ 
  onNavigate, 
  vehicleProfile, 
  onOpenVehicleSetup,
  onBookSlot
}) {
  const { user, token } = useAuth();
  const [activeReservations, setActiveReservations] = useState([]);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [soc, setSoc] = useState(78);

  // Live telemetry SoC drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSoc((prev) => (prev >= 100 ? 20 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch nearby stations capped within 50 km
  const fetchStations = async () => {
    try {
      setLoadingStations(true);
      const lat = vehicleProfile?.location?.lat;
      const lng = vehicleProfile?.location?.lng;
      const city = vehicleProfile?.location?.city || 'Local Area';

      if (!lat || !lng) {
        setNearbyStations([]);
        setLoadingStations(false);
        return;
      }

      let res = await fetch(`https://volt-slot.onrender.com/api/stations/nearby?lat=${lat}&lng=${lng}&maxDistance=50`);
      let data = await res.json();

      if (!Array.isArray(data) || data.length < 2) {
        await fetch(`https://volt-slot.onrender.com/api/stations/sync?lat=${lat}&lng=${lng}&distance=35&city=${encodeURIComponent(city)}`,  {
          method: 'POST'
        });
        res = await fetch(`https://volt-slot.onrender.com/api/stations/nearby?lat=${lat}&lng=${lng}&maxDistance=50`);
        data = await res.json();
      }

      if (Array.isArray(data)) {
        setNearbyStations(data);
      }
    } catch (err) {
      console.error('Failed to load nearby stations:', err);
    } finally {
      setLoadingStations(false);
    }
  };

  // 2. Fetch active reservations
  const fetchActiveReservations = async () => {
    try {
      setLoadingReservations(true);
      const activeUserId = user?._id || user?.id;
      if (!activeUserId) {
        setActiveReservations([]);
        return;
      }

      const res = await fetch(`https://volt-slot.onrender.com/api/reservations/user/${activeUserId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        const active = data.filter(
          (b) => b.status === 'Confirmed' || b.status === 'Checked-In'
        );
        setActiveReservations(active);
      }
    } catch (err) {
      console.error('Failed to load active reservations:', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchActiveReservations();
  }, [vehicleProfile, user, token]);

  const currentCityName = vehicleProfile?.location?.city 
    ? vehicleProfile.location.city.split(',')[0].trim().toUpperCase() 
    : 'LOCAL';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white p-6 sm:p-10 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#152026] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff]">Telemetry Active</span>
              <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, <span className="text-[#00e5ff]">{user?.name || 'Operator'}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#8899a6] mt-1">
              Locate nearby fast-charging hubs, inspect bay availability, and secure reservations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenVehicleSetup}
              className="px-4 py-2.5 bg-white dark:bg-[#0d1418] border border-slate-300 dark:border-[#1b262d] hover:border-[#00e5ff] rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm text-slate-700 dark:text-slate-200"
            >
              <Car size={15} className="text-[#00e5ff]" />
              <span>{vehicleProfile?.model ? `${vehicleProfile.model}` : 'Configure Vehicle'}</span>
            </button>
            <button
              onClick={() => onNavigate('stations')}
              className="px-5 py-2.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] cursor-pointer"
            >
              <Zap size={15} fill="black" /> Full Station Directory →
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] p-5 rounded-2xl shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8899a6] uppercase">Vehicle SoC</span>
              <BatteryCharging size={18} className="text-[#00e676]" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-[#00e676]">{soc}%</span>
              <span className="text-[11px] text-slate-400 font-mono">Live Telemetry</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#152026] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#00e676] h-full transition-all duration-500"
                style={{ width: `${soc}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] p-5 rounded-2xl shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8899a6] uppercase">Grid Availability</span>
              <Zap size={18} className="text-[#00e5ff]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">99.9%</div>
            <p className="text-[11px] text-slate-500 dark:text-[#8899a6]">Zero downtime reported across hubs</p>
          </div>

          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] p-5 rounded-2xl shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8899a6] uppercase">Green Offset</span>
              <Leaf size={18} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">0.82 Tons</div>
            <p className="text-[11px] text-slate-500 dark:text-[#8899a6]">Direct carbon avoided this month</p>
          </div>

          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] p-5 rounded-2xl shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8899a6] uppercase">Registered EV</span>
              <ShieldCheck size={18} className="text-[#00e5ff]" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white truncate">
              {vehicleProfile?.model || 'No Vehicle Configured'}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
              <span className="text-[#00e5ff]">
                {vehicleProfile?.regNumber || 'AP03CD1234'}
              </span>
              {vehicleProfile?.location?.city && (
                <span className="text-slate-400 flex items-center gap-0.5 truncate max-w-[110px]">
                  <MapPin size={10} /> {vehicleProfile.location.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Charging Stations - Clean 2-per-row grid without map interception */}
        <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] rounded-2xl p-6 shadow-sm transition-colors space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-[#152026]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#00e5ff] uppercase tracking-wider">
                  {currentCityName} GRID
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Nearby Charging Stations</h2>
              <p className="text-xs text-slate-500 dark:text-[#8899a6]">
                All active fast-charging hubs reachable within a 50 km perimeter.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchStations}
                className="p-2 text-slate-400 hover:text-[#00e5ff] rounded-lg transition-colors cursor-pointer"
                title="Refresh Stations"
              >
                <RefreshCw size={15} className={loadingStations ? 'animate-spin text-[#00e5ff]' : ''} />
              </button>
              <button
                onClick={() => onNavigate('stations')}
                className="text-xs font-mono text-[#00e5ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Full Station Directory <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {loadingStations ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-2">
              <RefreshCw className="animate-spin text-[#00e5ff]" size={20} />
              <span>Scanning localized EV hubs for {currentCityName}...</span>
            </div>
          ) : nearbyStations.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 font-mono">
              No active stations found within 50 km. Click &quot;Configure Vehicle&quot; to pin your location.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyStations.slice(0, 4).map((station) => (
                <div
                  key={station._id || station.id}
                  className="bg-slate-50 dark:bg-[#121c22] border border-slate-200 dark:border-[#1c2a32] hover:border-[#00e5ff]/60 rounded-xl p-5 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#00e5ff]/10 text-[#00e5ff]">
                          <Zap size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {station.name}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-rose-500" />
                            {station.address}, {station.city}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-[#00e676] border border-emerald-500/20 shrink-0">
                        {station.totalBays} Bays Total
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#18252d] border border-slate-200 dark:border-[#22333d]">
                        {station.powerOutputKw} kW Rapid
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-[#18252d] border border-slate-200 dark:border-[#22333d]">
                        ₹{station.pricingPerKwh}/kWh
                      </span>
                      {station.distanceKm !== undefined && (
                        <span className="text-[#00e5ff] font-semibold">
                          • {station.distanceKm} km away
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-[#18252d]">
                    <button
                      onClick={() => onNavigate('stations')}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#263742] hover:border-[#00e5ff] text-slate-700 dark:text-slate-300 hover:text-[#00e5ff] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin size={13} /> View on Map
                    </button>
                    <button
                      onClick={() => onBookSlot(station)}
                      className="px-4 py-1.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                    >
                      Book Bay <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Reservations & Allocations Panel */}
        <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] rounded-2xl p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-[#152026]">
            <div>
              <h2 className="text-lg font-bold">Active Reservations & Allocations</h2>
              <p className="text-xs text-slate-500 dark:text-[#8899a6]">
                Manage scheduled charging slots and auto-progression session status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchActiveReservations}
                className="p-1.5 text-slate-400 hover:text-[#00e5ff] rounded-lg transition-colors cursor-pointer"
                title="Refresh Bookings"
              >
                <RefreshCw size={14} className={loadingReservations ? 'animate-spin text-[#00e5ff]' : ''} />
              </button>
              <button
                onClick={() => onNavigate('my-bookings')}
                className="text-xs font-mono text-[#00e5ff] hover:underline cursor-pointer"
              >
                View All in Ledger →
              </button>
            </div>
          </div>

          {loadingReservations ? (
            <div className="py-10 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-2">
              <RefreshCw className="animate-spin text-[#00e5ff]" size={18} />
              <span>Checking active reservations...</span>
            </div>
          ) : activeReservations.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#152026] text-slate-400 flex items-center justify-center mb-3">
                <CalendarCheck size={22} />
              </div>
              <p className="text-sm font-semibold mb-1">No Active Reservations</p>
              <p className="text-xs text-slate-500 dark:text-[#8899a6] max-w-sm mb-4">
                You do not have any bay allocations scheduled right now. Discover nearby stations to reserve a slot.
              </p>
              <button
                onClick={() => onNavigate('stations')}
                className="px-4 py-2 bg-slate-100 dark:bg-[#152026] hover:bg-[#00e5ff] hover:text-black rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                Browse Stations →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeReservations.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-50 dark:bg-[#121c22] border border-slate-200 dark:border-[#1c2a32] hover:border-[#00e5ff]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00e5ff]">
                        Allocated Bay #{item.bayNumber}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.stationId?.name || 'Charging Station Hub'}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {item.stationId?.address}, {item.stationId?.city}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                        item.status === 'Checked-In'
                          ? 'bg-cyan-500/10 text-[#00e5ff] border border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-1.5 px-2.5 bg-white dark:bg-[#18252d] rounded-lg text-xs font-mono border border-slate-100 dark:border-[#22333d]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TIME WINDOW</span>
                      <span className="text-slate-700 dark:text-slate-200">
                        {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ESCROW PAID</span>
                      <span className="text-[#00e676] font-bold">₹{item.amountPaid}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Vehicle: {item.vehicleRegNumber}</span>
                    <button
                      onClick={() => onNavigate('my-bookings')}
                      className="text-[#00e5ff] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Manage Pass →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}