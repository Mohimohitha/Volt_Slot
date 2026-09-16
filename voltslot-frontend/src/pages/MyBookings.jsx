import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  MapPin, 
  XCircle, 
  RefreshCw, 
  QrCode, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function MyBookings({ onNavigate }) {
  const { user, token } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Local Toast states
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const activeUserId = user?._id || user?.id;
      if (!activeUserId) {
        setReservations([]);
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
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, token]);

  const confirmCancellation = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
        const res = await fetch(`https://volt-slot.onrender.com/api/reservations/${cancelTarget._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ userId: user?._id || user?.id })
      });
      const data = await res.json();
      if (res.ok) {
        const refundAmt = data.reservation?.refundAmount ?? cancelTarget.amountPaid;
        const isFullRefund = new Date() < new Date(cancelTarget.startTime);

        addNotification({
          title: `Escrow Refund Issued: ₹${refundAmt}`,
          message: `${isFullRefund ? '100% full refund' : '50% mid-session refund'} credited for ${cancelTarget.stationId?.name || 'EV Station'} (Bay #${cancelTarget.bayNumber}).`,
          type: 'refund'
        });

        showToast(data.message || `Refund issued: ₹${refundAmt}`, 'success');
        setCancelTarget(null);
        fetchBookings();
      } else {
        showToast(data.message || 'Cancellation failed.', 'error');
      }
    } catch (err) {
      showToast('Server connection error while cancelling.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white p-6 sm:p-10 font-sans transition-colors relative">
      
      {/* IN-APP TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-mono ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-600/40 backdrop-blur-md'
              : 'bg-[#001f28]/95 text-[#00e5ff] border-[#00e5ff]/40 backdrop-blur-md'
          }`}>
            {toast.type === 'error' ? (
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-[#00e676] shrink-0" />
            )}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#152026] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00e5ff]">Ledger & Digital Passes</span>
              <div className="w-2 h-2 rounded-full bg-[#00e676]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">My Charging Reservations</h1>
          </div>
          <button
            onClick={fetchBookings}
            className="p-2 border border-slate-200 dark:border-[#1c2a32] rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#00e5ff]' : ''} />
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-2">
            <RefreshCw className="animate-spin text-[#00e5ff]" size={20} />
            <span>Fetching reservation ledger...</span>
          </div>
        ) : reservations.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-slate-200 dark:border-[#18252d] bg-white dark:bg-[#0e161b] p-8 shadow-sm">
            <CalendarCheck size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="text-base font-bold mb-1">No Reservations Found</h3>
            <p className="text-xs text-slate-500 dark:text-[#8899a6] mb-4">You have not scheduled any bay allocations yet.</p>
            <button
              onClick={() => onNavigate('stations')}
              className="px-4 py-2 bg-[#00e5ff] text-black font-bold text-xs rounded-lg cursor-pointer hover:bg-[#00c8de] transition-colors"
            >
              Find Charging Station →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] hover:border-[#00e5ff]/40 rounded-xl p-5 space-y-4 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.stationId?.name || 'EV Station'}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-rose-500 shrink-0" />
                      {item.stationId?.address}, {item.stationId?.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                        item.status === 'Cancelled'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : item.status === 'Completed'
                          ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          : item.status === 'Checked-In'
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-[#00e5ff] border border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.paymentStatus !== 'Paid' && (
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                        {item.paymentStatus} (₹{item.refundAmount})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-100 dark:bg-[#121c22] rounded-lg text-xs font-mono border border-slate-200 dark:border-[#1a262e]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">BAY</span>
                    <span className="text-cyan-700 dark:text-[#00e5ff] font-bold">#{item.bayNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PLATE</span>
                    <span className="text-slate-900 dark:text-white font-semibold truncate block">{item.vehicleRegNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AMOUNT</span>
                    <span className="text-emerald-600 dark:text-[#00e676] font-bold">₹{item.amountPaid}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#18252d]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPass(item)}
                      className="px-2.5 py-1 bg-cyan-50 dark:bg-[#00e5ff]/10 hover:bg-cyan-100 dark:hover:bg-[#00e5ff]/20 text-cyan-700 dark:text-[#00e5ff] rounded-md text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-cyan-300 dark:border-[#00e5ff]/30 font-semibold"
                    >
                      <QrCode size={12} /> View QR
                    </button>

                    {(item.status === 'Confirmed' || item.status === 'Checked-In') && (
                      <button
                        onClick={() => setCancelTarget(item)}
                        className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors px-1"
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: VIEW DIGITAL PASS & QR CODE (HIGH CONTRAST) */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1c2a32] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
            
            {/* Header with Dark/Light Close Icon */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-[#18252d]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-cyan-700 dark:text-[#00e5ff] font-bold">
                <ShieldCheck size={14} /> Official Check-in Pass
              </div>
              <button
                onClick={() => setSelectedPass(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors p-1"
                aria-label="Close pass"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                {selectedPass.stationId?.name || 'EV Station'}
              </h3>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Pass ID: {selectedPass._id}
              </p>
            </div>

            {/* Rendered Live QR Code */}
            <div className="p-4 bg-white rounded-xl shadow-inner inline-block mx-auto border border-slate-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=VOLTSLOT:${selectedPass._id}:${selectedPass.vehicleRegNumber}:BAY${selectedPass.bayNumber}`}
                alt="Digital Check-in QR"
                className="w-40 h-40 mx-auto"
              />
              <div className="text-[10px] font-mono text-slate-800 font-bold mt-1.5 flex items-center justify-center gap-1">
                <QrCode size={12} /> Scan at Physical Bay
              </div>
            </div>

            {/* High-Contrast Pass Details */}
            <div className="p-3.5 bg-slate-100 dark:bg-[#131c22] rounded-xl text-left text-xs font-mono space-y-2 border border-slate-200 dark:border-[#1c2a32]">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Allocated Bay:</span>
                <span className="text-cyan-700 dark:text-[#00e5ff] font-bold">
                  Bay #{selectedPass.bayNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Vehicle Plate:</span>
                <span className="text-slate-900 dark:text-amber-300 font-bold tracking-wide">
                  {selectedPass.vehicleRegNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Slot Window:</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {new Date(selectedPass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedPass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Total Paid:</span>
                <span className="text-emerald-600 dark:text-[#00e676] font-bold">
                  ₹{selectedPass.amountPaid}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full py-2.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP CANCELLATION CONFIRMATION */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#1c2a32] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-500">
              <AlertTriangle size={22} />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Cancel Reservation</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              Are you sure you want to cancel the reservation for <span className="text-slate-900 dark:text-white font-bold">{cancelTarget.stationId?.name}</span>?
            </p>

            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#121c22] border border-slate-200 dark:border-[#1a262e] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Refund Policy:</span>
                <span className="text-emerald-600 dark:text-[#00e676] font-bold">Escrow Protected</span>
              </div>
              <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Cancellation before start time: <strong className="text-emerald-600 dark:text-emerald-400">100% Full Refund (₹{cancelTarget.amountPaid})</strong></li>
                <li>Cancellation during active slot: <strong className="text-amber-700 dark:text-amber-400">50% Mid-slot penalty (₹{(cancelTarget.amountPaid * 0.5).toFixed(0)})</strong></li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 border border-slate-300 dark:border-[#1f2d37] rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={confirmCancellation}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Processing Refund...' : 'Confirm & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}