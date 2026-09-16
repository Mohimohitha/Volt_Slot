import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Car, MapPin, CheckCircle, X } from 'lucide-react';

// Fix standard Leaflet default marker icon path issue in bundlers (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to fix map rendering inside dynamic modals
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    // Invalidate size immediately and after modal animation completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Click listener to pin new coordinates
function LocationPicker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

const EV_MODELS = [
  'Tata Nexon EV (40.5 kWh)',
  'Tata Punch EV (35 kWh)',
  'MG ZS EV (50.3 kWh)',
  'Hyundai Ioniq 5 (72.6 kWh)',
  'Mahindra XUV400 (39.4 kWh)',
  'BYD Atto 3 (60.48 kWh)',
  'Kia EV6 (77.4 kWh)',
];

export default function VehicleOnboardingModal({ isOpen, user, currentProfile, onComplete, onClose }) {
  const [model, setModel] = useState('Tata Nexon EV (40.5 kWh)');
  const [regNumber, setRegNumber] = useState('');
  const [city, setCity] = useState('Tirupati, Andhra Pradesh');
  const [position, setPosition] = useState({ lat: 13.6288, lng: 79.4192 });
  const [error, setError] = useState('');

  // Pre-fill fields whenever the modal opens with existing saved data
  useEffect(() => {
    if (!isOpen || !user) return;

    const userKey = `voltslot_vehicle_${user.id || user._id || user.email}`;
    const saved = currentProfile || JSON.parse(localStorage.getItem(userKey) || 'null');

    if (saved) {
      setModel(saved.model || EV_MODELS[0]);
      setRegNumber(saved.regNumber || '');
      setCity(saved.location?.city || 'Tirupati, Andhra Pradesh');
      if (saved.location?.lat && saved.location?.lng) {
        setPosition({ lat: saved.location.lat, lng: saved.location.lng });
      }
    }
  }, [isOpen, user, currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      setError('Please enter your vehicle registration plate number.');
      return;
    }

    const profileData = {
      model,
      regNumber: regNumber.trim().toUpperCase(),
      location: {
        city: city.trim() || 'Tirupati',
        lat: position.lat,
        lng: position.lng,
      },
    };

    const userKey = `voltslot_vehicle_${user.id || user._id || user.email}`;
    localStorage.setItem(userKey, JSON.stringify(profileData));
    setError('');
    onComplete(profileData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1e2c34] text-slate-900 dark:text-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden transition-all">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-[#18252d] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00e5ff]/15 flex items-center justify-center text-[#00e5ff] shrink-0">
              <Car size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Configure Vehicle & Location</h2>
              <p className="text-xs text-slate-500 dark:text-[#8899a6] mt-0.5">
                Set up your vehicle details and pin your location for smart bay reservations.
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Model & Plate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#8899a6] mb-1.5">
                Select EV Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121c22] border border-slate-300 dark:border-[#1e2c34] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00e5ff]"
              >
                {EV_MODELS.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-[#121c22]">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#8899a6] mb-1.5">
                Vehicle Plate Number
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="E.G. AP03CD1234"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121c22] border border-slate-300 dark:border-[#1e2c34] rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:border-[#00e5ff]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Format: State Code + Digits (e.g. AP03CD1234)
              </span>
            </div>
          </div>

          {/* City / Landmark */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-[#8899a6] mb-1.5">
              City / Landmark
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Tirupati, Andhra Pradesh"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121c22] border border-slate-300 dark:border-[#1e2c34] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#00e5ff]"
            />
          </div>

          {/* Map Section */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-slate-600 dark:text-[#8899a6] flex items-center gap-1">
                <MapPin size={12} className="text-[#00e5ff]" /> Click map to pin location (Tirupati)
              </span>
              <span className="text-[#00e5ff]">
                Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
              </span>
            </div>

            {/* Leaflet Map Box Container */}
            <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1e2c34] relative z-0">
              <MapContainer
                center={[position.lat, position.lng]}
                zoom={13}
                zoomControl={true}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapResizer />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              <CheckCircle size={16} /> Save Profile & Access Dashboard
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}