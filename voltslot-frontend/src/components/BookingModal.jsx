import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  CreditCard, 
  AlertCircle, 
  ArrowRight, 
  Smartphone, 
  ShieldCheck, 
  Check,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ station, vehicleProfile, onClose, onBookingSuccess }) {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [bayNumber, setBayNumber] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(45);
  
  const getInitialTime = () => {
    const d = new Date(Date.now() + 15 * 60000);
    d.setSeconds(0, 0);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(getInitialTime);
  const [reservedBays, setReservedBays] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [vpa, setVpa] = useState('operator@axisbank');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedReservation, setBookedReservation] = useState(null);

  if (!station) return null;

  const pricingPerKwh = station.pricingPerKwh || 18;
  const calculatedCost = Math.round(durationMinutes * (pricingPerKwh / 2));
  const regNumber = vehicleProfile?.regNumber || 'AP03CD1234';

  // Check bay occupancy whenever station, start time, or duration changes
  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        setCheckingAvailability(true);
        const stId = station._id || station.id;
        const res = await fetch(
          `https://volt-slot.onrender.com/api/reservations/availability/${stId}?startTime=${new Date(startTime).toISOString()}&durationMinutes=${durationMinutes}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.reservedBays)) {
          setReservedBays(data.reservedBays);

          // If currently selected bay is already taken, switch to first available
          if (data.reservedBays.includes(bayNumber)) {
            const allBays = Array.from({ length: station.totalBays || 4 }, (_, i) => i + 1);
            const firstAvailable = allBays.find((b) => !data.reservedBays.includes(b));
            if (firstAvailable) setBayNumber(firstAvailable);
          }
        }
      } catch (err) {
        console.error('Availability check failed:', err);
      } finally {
        setCheckingAvailability(false);
      }
    };

    fetchOccupancy();
  }, [station, startTime, durationMinutes]);

  const handleBookingAndPayment = async () => {
    setError('');
    setLoading(true);

    try {
      const activeUserId = user?._id || user?.id;
      if (!activeUserId) {
        throw new Error('User session expired. Please sign in again.');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await fetch('https://volt-slot.onrender.com/api/reservations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userId: activeUserId,
          stationId: station._id || station.id,
          bayNumber: Number(bayNumber),
          startTime: new Date(startTime).toISOString(),
          durationMinutes: Number(durationMinutes),
          vehicleRegNumber: regNumber,
          amountPaid: calculatedCost
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Slot allocation failed.');
      }

      setBookedReservation(data.reservation);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // QR Code URL based on unique reservation reference
  const qrDataUrl = bookedReservation 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=VOLTSLOT:${bookedReservation._id}:${bookedReservation.vehicleRegNumber}:BAY${bookedReservation.bayNumber}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1c2a32] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-[#18252d] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-700 dark:text-[#00e5ff] font-bold uppercase tracking-wider">
                {step === 1 && 'Step 1: Bay Allocation'}
                {step === 2 && 'Step 2: Instant Payment'}
                {step === 3 && 'Order Confirmed & Digital Pass'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-sm">
              {station.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="m-6 mb-0 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-mono">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Bay & Time */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold uppercase">
                  Select Charging Bay
                </label>
                {checkingAvailability && (
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-[#00e5ff] animate-pulse">
                    Checking occupancy...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: station.totalBays || 4 }, (_, i) => i + 1).map((b) => {
                  const isReserved = reservedBays.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      disabled={isReserved}
                      onClick={() => setBayNumber(b)}
                      className={`py-2.5 rounded-lg text-xs font-mono border transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isReserved
                          ? 'border-slate-200 dark:border-[#1a252c] bg-slate-100 dark:bg-[#121a20] text-slate-400 cursor-not-allowed opacity-60'
                          : bayNumber === b
                          ? 'bg-cyan-50 dark:bg-[#00e5ff]/15 border-cyan-600 dark:border-[#00e5ff] text-cyan-700 dark:text-[#00e5ff] font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)] cursor-pointer'
                          : 'border-slate-300 dark:border-[#1f2d37] bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer'
                      }`}
                    >
                      <span>Bay #{b}</span>
                      {isReserved && (
                        <span className="text-[9px] text-rose-600 dark:text-rose-400 font-sans uppercase font-bold">
                          Reserved
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mb-1.5 block uppercase">
                  Session Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#131c22] border border-slate-300 dark:border-[#1f2d37] rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-[#00e5ff]"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mb-1.5 block uppercase">
                  Vehicle Plate
                </label>
                <div className="w-full bg-slate-100 dark:bg-[#131c22] border border-slate-300 dark:border-[#1f2d37] rounded-lg p-2.5 text-xs font-mono text-cyan-700 dark:text-[#00e5ff] font-bold">
                  {regNumber}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mb-1.5 block uppercase">
                Reservation Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#131c22] border border-slate-300 dark:border-[#1f2d37] rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-[#00e5ff]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#131c22] border border-slate-200 dark:border-[#1f2d37] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tariff Rate:</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">₹{pricingPerKwh}/kWh</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Calculated Slot Fee:</span>
                <span className="text-cyan-700 dark:text-[#00e5ff] font-bold">₹{calculatedCost}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 dark:border-[#1f2d37] rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reservedBays.includes(bayNumber)}
                onClick={() => setStep(2)}
                className="px-5 py-2 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
              >
                Proceed to Payment <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Instant Payment Gateway */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#131c22] border border-slate-200 dark:border-[#1f2d37] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Amount Due</span>
                <div className="text-2xl font-black text-cyan-700 dark:text-[#00e5ff]">₹{calculatedCost}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-[#00e676] font-semibold">
                <ShieldCheck size={16} /> Instant Escrow Allocation
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mb-2 block uppercase">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', icon: Smartphone, label: 'UPI' },
                  { id: 'Card', icon: CreditCard, label: 'Card' },
                  { id: 'Wallet', icon: Zap, label: 'EV Wallet' }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = paymentMethod === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-600 dark:border-[#00e5ff] bg-cyan-50 dark:bg-[#00e5ff]/10 text-cyan-700 dark:text-[#00e5ff] font-bold shadow-sm'
                          : 'border-slate-300 dark:border-[#1f2d37] bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold mb-1 block uppercase">
                  VPA Address
                </label>
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#131c22] border border-slate-300 dark:border-[#1f2d37] rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-600 dark:focus:border-[#00e5ff]"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleBookingAndPayment}
                disabled={loading}
                className="px-6 py-2.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-extrabold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00e5ff]/20 disabled:opacity-50 transition-all"
              >
                <Zap size={14} fill="black" />
                {loading ? 'Confirming with Gateway...' : `Pay ₹${calculatedCost} & Book Bay`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmed & QR Check-in Pass */}
        {step === 3 && bookedReservation && (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/15 text-emerald-600 dark:text-[#00e676] rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check size={24} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Bay Reserved & Confirmed!</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Pass ID: {bookedReservation._id}
              </p>
            </div>

            {/* Check-In QR Pass */}
            <div className="p-4 bg-white rounded-xl shadow-inner inline-block mx-auto border border-slate-200">
              <img
                src={qrDataUrl}
                alt="Check-in Pass QR"
                className="w-36 h-36 mx-auto"
              />
              <div className="text-[10px] font-mono text-slate-800 font-bold mt-1.5 flex items-center justify-center gap-1">
                <QrCode size={12} /> Scan at Hub Charger
              </div>
            </div>

            {/* High-Contrast Summary Card for Light and Dark Modes */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#131c22] border border-slate-200 dark:border-[#1f2d37] text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Station:</span>
                <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px]">
                  {station.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Allocated Bay:</span>
                <span className="text-cyan-700 dark:text-[#00e5ff] font-bold">
                  Bay #{bookedReservation.bayNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Vehicle Plate:</span>
                <span className="text-amber-800 dark:text-amber-300 font-bold tracking-wide">
                  {bookedReservation.vehicleRegNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Amount Paid:</span>
                <span className="text-emerald-600 dark:text-[#00e676] font-bold">
                  ₹{bookedReservation.amountPaid}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onBookingSuccess) onBookingSuccess(bookedReservation);
                onClose();
              }}
              className="w-full py-2.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              Done & View on Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}