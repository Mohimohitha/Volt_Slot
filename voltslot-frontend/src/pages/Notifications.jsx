import React from 'react';
import { 
  Bell, 
  Calendar, 
  Check, 
  CheckCheck, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Notifications({ onNavigate }) {
  const { notifications, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white p-6 sm:p-10 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header matching reference */}
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#00e5ff] uppercase block mb-1">
            VOLTSLOT
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8899a6] mt-1">
            Stay updated about your charging activity, reservation confirmations, and refunds.
          </p>
        </div>

        {/* Main Notifications Card Container */}
        <div className="bg-white dark:bg-[#0e161b] border border-slate-200 dark:border-[#18252d] rounded-2xl p-6 sm:p-8 shadow-sm transition-colors space-y-6">
          
          {/* Inner Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#152026]">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Notifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8899a6] mt-0.5">
                Booking confirmations, reminders, and escrow refund updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-mono text-[#00e676] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={14} /> Mark All as Read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-xs font-mono text-rose-400 hover:underline flex items-center gap-1 cursor-pointer ml-2"
                  >
                    <Trash2 size={13} /> Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List of Notification Items */}
          {notifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#152026] text-slate-400 flex items-center justify-center mx-auto">
                <Bell size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Notifications</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have no recent activity. Reserved charging bays and refund confirmations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    notif.read
                      ? 'bg-slate-50/70 dark:bg-[#121c22]/50 border-slate-200 dark:border-[#1a252d]'
                      : 'bg-white dark:bg-[#131e25] border-[#00e5ff]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Calendar/Icon Box from reference */}
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      notif.type === 'refund'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/20'
                    }`}>
                      <Calendar size={18} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#8899a6] leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
                        <Clock size={11} />
                        <span>
                          {new Date(notif.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}, {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Status Badge from reference */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-[#00e676] border border-emerald-500/20">
                      Booking
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                      <Check size={11} className="text-slate-500" /> Read
                    </span>
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