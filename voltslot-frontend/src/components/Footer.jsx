import { useState } from 'react';
import { Zap, Send, Shield } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    alert('Thank you for subscribing to VoltSlot updates!');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200 dark:border-[#152026] bg-white dark:bg-[#070b0e] text-slate-600 dark:text-[#8899a6] pt-14 pb-8 px-6 transition-colors font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Section: Branding, Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff]">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                volt<span className="text-[#00e5ff]">Slot</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8899a6] leading-relaxed max-w-sm">
              Experience seamless EV charging with real-time station discovery and instant slot booking. The world&apos;s smartest charging network.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('stations')} 
                  className="hover:text-[#00e5ff] transition-colors cursor-pointer"
                >
                  Find Stations
                </button>
              </li>
              <li>
                <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Pricing</span>
              </li>
              <li>
                <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Mobile App</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">About Us</span>
              </li>
              <li>
                <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Careers</span>
              </li>
              <li>
                <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Contact</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Stay Updated</h4>
            <p className="text-xs text-slate-500 dark:text-[#8899a6]">
              Get the latest news on EV charging and our network expansion.
            </p>
            <form onSubmit={handleNewsletter} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-[#0e161b] border border-slate-300 dark:border-[#1b262d] rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00e5ff] transition-all"
              />
              <button
                type="submit"
                className="p-2 bg-[#00e5ff] hover:bg-[#00c8de] text-black rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Compliance & Security */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#152026] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>© 2026 VoltSlot Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#00e5ff] cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <Shield size={12} /> SSL Encrypted
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}