import { useState } from 'react';
import { 
  Zap, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X,
  Compass,
  CalendarCheck,
  Bell,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fullName = user?.name || 'Operator';
  const firstName = fullName.split(' ')[0].toLowerCase();
  const initial = fullName.trim().charAt(0).toUpperCase();

  return (
    <nav className="border-b border-slate-200 dark:border-[#152026] bg-white/80 dark:bg-[#070b0e]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo - 1:1 match with Footer */}
        <div 
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff]">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            volt<span className="text-[#00e5ff]">Slot</span>
          </span>
        </div>

        {/* Center Desktop Navigation (Logged In) */}
        {user ? (
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentPage === 'dashboard'
                  ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/10 border border-[#00e5ff]/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('stations')}
              className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentPage === 'stations'
                  ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/10 border border-[#00e5ff]/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>Stations</span>
            </button>

            <button
              onClick={() => onNavigate('my-bookings')}
              className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentPage === 'my-bookings'
                  ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/10 border border-[#00e5ff]/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarCheck size={14} />
              <span>My Bookings</span>
            </button>

            <button
              onClick={() => onNavigate('notifications')}
              className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer relative ${
                currentPage === 'notifications'
                  ? 'text-[#00e5ff] font-bold bg-[#00e5ff]/10 border border-[#00e5ff]/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell size={14} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              )}
            </button>
          </div>
        ) : (
          /* Public Landing Navigation Links */
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Platform
            </button>
            <button 
              onClick={() => onNavigate('signin')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Network Hubs
            </button>
            <button 
              onClick={() => onNavigate('signin')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Enterprise
            </button>
          </div>
        )}

        {/* Right Action Stack */}
        <div className="flex items-center gap-3">
          
          {/* User Profile Pill (Authenticated) */}
          {user ? (
            <>
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full bg-slate-50 dark:bg-[#0d1418] border border-slate-200 dark:border-[#1b272e] hover:border-[#00e5ff]/60 transition-colors shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/40 flex items-center justify-center">
                    <span className="font-bold text-xs text-[#00e5ff]">
                      {initial}
                    </span>
                  </div>

                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 lowercase">
                      {firstName}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] shrink-0 inline-block" />
                      <span className="text-[10px] font-mono text-[#00e676] leading-none">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 pointer-events-none transition-all">
                  <div className="w-56 p-3 rounded-2xl bg-white dark:bg-[#0d151a] border border-slate-200 dark:border-[#1c2a32] shadow-xl space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold text-xs">
                        {initial}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{fullName}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{user?.email || 'Driver Session'}</div>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 dark:border-[#162229] flex items-center justify-between text-[10px] font-mono text-[#00e5ff]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified Driver
                      </span>
                      <span className="text-slate-400">EV Fleet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-[#1c2a32] transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            /* Sign In & Register Member (Unauthenticated Landing View) */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('signin')}
                className="px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-200 hover:text-[#00e5ff] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onNavigate('signup')}
                className="px-3.5 py-1.5 bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs font-mono rounded-lg transition-all shadow-[0_0_12px_rgba(0,229,255,0.25)] flex items-center gap-1 cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Register Member</span>
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1c2a32] transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 rounded-lg border border-slate-200 dark:border-[#1c2a32]"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-[#152026] bg-white dark:bg-[#070b0e] px-6 py-4 space-y-2 font-mono text-xs">
          {user ? (
            <>
              <button
                onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-slate-700 dark:text-slate-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => { onNavigate('stations'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-slate-700 dark:text-slate-300"
              >
                Stations
              </button>
              <button
                onClick={() => { onNavigate('my-bookings'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-slate-700 dark:text-slate-300"
              >
                My Bookings
              </button>
              <button
                onClick={() => { onNavigate('notifications'); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-slate-700 dark:text-slate-300"
              >
                Notifications ({unreadCount})
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left py-2 text-rose-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { onNavigate('signin'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 rounded-lg border border-slate-200 dark:border-[#1c2a32] text-slate-800 dark:text-slate-200"
              >
                Sign In
              </button>
              <button
                onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 rounded-lg bg-[#00e5ff] text-black font-bold"
              >
                Register Member
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}