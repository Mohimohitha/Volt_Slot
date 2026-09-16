import { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  ArrowRight, 
  RefreshCw, 
  Compass, 
  Map as MapIcon, 
  X 
} from 'lucide-react';
import StationMap from '../components/StationMap';

export default function Stations({ vehicleProfile, onBookSlot }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [modalTargetStation, setModalTargetStation] = useState(null); // null = View All Stations

  const fetchAllStations = async () => {
    try {
      setLoading(true);
      const lat = vehicleProfile?.location?.lat || 17.3850;
      const lng = vehicleProfile?.location?.lng || 78.4867;
      const city = vehicleProfile?.location?.city || 'Local Area';

      let res = await fetch(`https://volt-slot.onrender.com/api/stations/nearby?lat=${lat}&lng=${lng}&maxDistance=50`);
      let data = await res.json();

      if (!Array.isArray(data) || data.length < 2) {
        await fetch(`https://volt-slot.onrender.com/api/stations/sync?lat=${lat}&lng=${lng}&distance=35&city=${encodeURIComponent(city)}`, {
          method: 'POST'
        });
        res = await fetch(`https://volt-slot.onrender.com/api/stations/nearby?lat=${lat}&lng=${lng}&maxDistance=50`);
        data = await res.json();
      }

      if (Array.isArray(data)) {
        setStations(data);
      }
    } catch (err) {
      console.error('Failed to load stations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStations();
  }, [vehicleProfile]);

  const cityName = vehicleProfile?.location?.city 
    ? vehicleProfile.location.city.split(',')[0].trim().toUpperCase() 
    : 'LOCAL';

  const handleOpenAllOnMap = () => {
    setModalTargetStation(null);
    setShowMapModal(true);
  };

  const handleOpenSingleStationOnMap = (st) => {
    setModalTargetStation(st);
    setShowMapModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white p-6 sm:p-10 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header matching Dashboard aesthetic */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#152026] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff]">{cityName} EV GRID</span>
              <div className="w-2 h-2 rounded-full bg-[#00e676]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Available Charging Stations</h1>
            <p className="text-xs text-slate-500 dark:text-[#8899a6] mt-1">
              All active fast-charging hubs reachable within a 50 km perimeter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View All Stations in Map Link */}
            <button
              onClick={handleOpenAllOnMap}
              className="px-3.5 py-2 rounded-lg bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapIcon size={14} /> View All Stations on Map
            </button>

            <button
  onClick={fetchAllStations}
  className="p-2 border border-slate-300 dark:border-[#1c2a32] rounded-lg text-slate-700 dark:text-slate-300 hover:text-[#00e5ff] hover:border-[#00e5ff]/50 flex items-center gap-2 text-xs font-mono cursor-pointer transition-colors"
  title="Refresh Grid"
>
  <RefreshCw size={14} className={loading ? 'animate-spin text-[#00e5ff]' : ''} />
  <span>Refresh Grid</span>
</button>
          </div>
        </div>

        {/* Stations Content - Clean 2-per-row grid matching Dashboard */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-2">
            <RefreshCw className="animate-spin text-[#00e5ff]" size={20} />
            <span>Scanning local hubs in {cityName}...</span>
          </div>
        ) : stations.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-[#18252d] bg-white dark:bg-[#0e161b] p-8 shadow-sm">
            <Compass size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold mb-1">No Active Stations Within 50 km</h3>
            <p className="text-xs text-slate-500 dark:text-[#8899a6] mb-4">Click below to trigger a station sync or update your location.</p>
            <button
              onClick={fetchAllStations}
              className="px-4 py-2 bg-[#00e5ff] text-black font-bold text-xs rounded-lg cursor-pointer"
            >
              Sync Charging Stations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((st) => (
              <div
                key={st._id || st.id}
                className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1c2a32] hover:border-[#00e5ff]/60 rounded-xl p-5 flex flex-col justify-between gap-4 group shadow-sm transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#00e5ff]/10 text-[#00e5ff]">
                        <Zap size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#00e5ff] transition-colors">
                          {st.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-rose-500 shrink-0" />
                          {st.address}, {st.city}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                      {st.totalBays} Bays Total
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#18252d] border border-slate-200 dark:border-[#22333d]">
                      {st.powerOutputKw} kW Rapid
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#18252d] border border-slate-200 dark:border-[#22333d]">
                      ₹{st.pricingPerKwh}/kWh
                    </span>
                    {st.distanceKm !== undefined && (
                      <span className="text-[#00e5ff] font-semibold">
                        • {st.distanceKm} km away
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#18252d]">
                  {/* View this single station on map */}
                  <button
                    onClick={() => handleOpenSingleStationOnMap(st)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#263742] hover:border-[#00e5ff] text-slate-700 dark:text-slate-300 hover:text-[#00e5ff] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MapPin size={13} /> View on Map
                  </button>

                  <button
                    onClick={() => onBookSlot(st)}
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

      {/* DEDICATED GEOSPATIAL MAP MODAL */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1c2a32] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#18252d] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#00e5ff]/10 text-[#00e5ff]">
                  <MapIcon size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {modalTargetStation ? modalTargetStation.name : `All ${cityName} Charging Stations`}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {modalTargetStation ? modalTargetStation.address : `Displaying ${stations.length} active hubs across your perimeter`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Isolated Map Container */}
            <StationMap
              stations={modalTargetStation ? [modalTargetStation] : stations}
              userLocation={vehicleProfile?.location}
              focusedStation={modalTargetStation}
              onSelectStation={(st) => {
                setShowMapModal(false);
                onBookSlot(st);
              }}
              height="480px"
            />

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <span>Use double click or on-screen controls to zoom.</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}