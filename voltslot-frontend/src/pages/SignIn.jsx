import { useState } from 'react';
import { ArrowRight, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SignIn({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://volt-slot.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white flex flex-col justify-between font-sans transition-colors">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-full">
        
        {/* --- Left Hero Brand Panel --- */}
        <div className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 overflow-hidden border-r border-slate-200 dark:border-[#152026]">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.45] dark:brightness-[0.38] contrast-[1.15]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-[#070b0e] via-transparent to-slate-900/80 dark:to-[#070b0e]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/40 dark:via-[#070b0e]/30 to-slate-950 dark:to-[#070b0e]" />

          {/* Clean Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <button 
              type="button" 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="p-1.5 rounded-lg bg-[#00e5ff]/15 text-[#00e5ff] flex items-center justify-center">
                <Zap size={20} fill="#00e5ff" />
              </div>
              <div className="flex items-baseline text-2xl font-bold tracking-tight">
                <span className="text-[#00e5ff] font-extrabold tracking-tighter">volt</span>
                <span className="text-white ml-0.5 font-semibold">Slot</span>
              </div>
            </button>
            
            <button 
              type="button"
              onClick={() => onNavigate('landing')} 
              className="text-[11px] font-mono tracking-wider text-slate-300 dark:text-[#8899a6] hover:text-[#00e5ff] transition-colors cursor-pointer"
            >
              ← BACK TO HOME
            </button>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-xl my-auto py-12 text-white">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6">
              The Future of <br />
              <span>Charge</span> <br />
              Management.
            </h1>
            <p className="text-slate-300 dark:text-[#8899a6] text-sm leading-relaxed mb-10 max-w-md">
              Access the most advanced EV infrastructure network with a single tap. Precision, speed, and intelligence in every slot.
            </p>

            <div className="flex items-center gap-12 pt-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-emerald-400 dark:text-[#00e676] uppercase block mb-1">Active Grid</span>
                <span className="text-2xl font-bold tracking-tight">99.9%</span>
              </div>
              <div className="w-[1px] h-8 bg-white/20 dark:bg-[#1a262d]" />
              <div>
                <span className="font-mono text-[10px] tracking-widest text-emerald-400 dark:text-[#00e676] uppercase block mb-1">Smart Slots</span>
                <span className="text-2xl font-bold tracking-tight">2.4k+</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 dark:text-[#4d5e68] tracking-wide">
            © 2026 VoltSlot. High-Octane Infrastructure.
          </div>
        </div>

        {/* --- Right Form Panel --- */}
        <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[420px]">
            
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Initialize Access</h2>
              <p className="text-slate-500 dark:text-[#8899a6] text-xs leading-relaxed">
                Enter your credentials to connect to the VoltSlot ecosystem.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-[#8899a6] uppercase block mb-1.5">
                  Email
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@voltslot.io"
                  className="w-full bg-white dark:bg-[#0d1418] border border-slate-300 dark:border-[#1b262d] focus:border-[#00e5ff] rounded-lg px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#2b3a42] outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="signin-password" className="font-mono text-[10px] tracking-widest text-slate-500 dark:text-[#8899a6] uppercase block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-[#0d1418] border border-slate-300 dark:border-[#1b262d] focus:border-[#00e5ff] rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#2b3a42] outline-none transition-colors tracking-widest"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-[#8899a6] hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#00e5ff] rounded cursor-pointer"
                  />
                  <span className="font-mono text-[11px]">Remember Machine</span>
                </label>
                <a href="#" className="font-mono text-[11px] text-slate-500 dark:text-[#8899a6] hover:text-[#00e5ff] transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00e5ff] hover:bg-[#00c8de] text-black font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login'} <ArrowRight size={15} />
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500 dark:text-[#8899a6]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-mono text-emerald-600 dark:text-[#00e676] hover:underline ml-1 cursor-pointer font-semibold"
              >
                Register Member
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}