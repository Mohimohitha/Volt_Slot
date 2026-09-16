import { useEffect, useRef } from 'react';

export default function StationMap({ 
  stations = [], 
  userLocation, 
  focusedStation, 
  onSelectStation,
  height = "420px"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const defaultCenter = focusedStation?.location?.lat 
    ? [focusedStation.location.lat, focusedStation.location.lng]
    : userLocation?.lat && userLocation?.lng 
    ? [userLocation.lat, userLocation.lng] 
    : [17.3850, 78.4867];

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: true // Controlled inside the isolated modal
      }).setView(defaultCenter, focusedStation ? 14 : 12);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Render user pin
    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = window.L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 14px; 
            height: 14px; 
            background: #00e676; 
            border: 2px solid #ffffff; 
            border-radius: 50%; 
            box-shadow: 0 0 10px #00e676;
          "></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const userMarker = window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<span style="font-family:monospace;font-size:11px;font-weight:bold;color:#00e676;">📍 Your Pinned Location</span>');
      markersRef.current.push(userMarker);
    }

    // Render station pins
    stations.forEach((st) => {
      const lat = st.location?.lat;
      const lng = st.location?.lng;
      if (!lat || !lng) return;

      const isTargeted = focusedStation?._id === st._id;

      const stationIcon = window.L.divIcon({
        className: 'custom-station-marker',
        html: `
          <div style="
            width: ${isTargeted ? '32px' : '26px'}; 
            height: ${isTargeted ? '32px' : '26px'}; 
            background: ${isTargeted ? '#00e5ff' : '#0e161b'}; 
            border: 2px solid #00e5ff; 
            border-radius: 8px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 0 ${isTargeted ? '16px #00e5ff' : '6px rgba(0,229,255,0.4)'};
            cursor: pointer;
          ">
            <span style="color: ${isTargeted ? '#000000' : '#00e5ff'}; font-size: 12px; font-weight: bold;">⚡</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = window.L.marker([lat, lng], { icon: stationIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 170px; padding: 2px;">
          <div style="font-weight: 800; font-size: 13px; color: #fff; margin-bottom: 2px;">${st.name}</div>
          <div style="font-size: 10px; color: #8899a6; font-family: monospace; margin-bottom: 8px;">${st.address}</div>
          <div style="display: flex; gap: 6px; font-size: 10px; font-family: monospace; margin-bottom: 10px;">
            <span style="background: rgba(0,229,255,0.15); color: #00e5ff; padding: 2px 6px; border-radius: 4px;">${st.powerOutputKw} kW</span>
            <span style="background: rgba(0,230,118,0.15); color: #00e676; padding: 2px 6px; border-radius: 4px;">₹${st.pricingPerKwh}/kWh</span>
          </div>
          <button id="map-modal-book-${st._id}" style="
            width: 100%;
            background: #00e5ff;
            color: #000;
            border: none;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
            border-radius: 6px;
            cursor: pointer;
          ">Book Bay Slot →</button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-modal-book-${st._id}`);
        if (btn && onSelectStation) {
          btn.onclick = () => onSelectStation(st);
        }
      });

      if (isTargeted) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });

    // Fit bounds or center targeted
    if (focusedStation?.location?.lat && focusedStation?.location?.lng) {
      map.setView([focusedStation.location.lat, focusedStation.location.lng], 15);
    }

  }, [stations, userLocation, focusedStation]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height }} 
      className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-[#1c2a32] shadow-inner relative z-0"
    />
  );
}