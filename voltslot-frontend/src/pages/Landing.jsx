import { 
  Zap, 
  MapPin, 
  Leaf, 
  Gauge, 
  CircleDollarSign, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Landing({ onNavigate }) {
  const { user } = useAuth();

  const handleFindStation = () => {
    if (user) {
      onNavigate && onNavigate('stations');
    } else {
      onNavigate && onNavigate('signin');
    }
  };

  const handleScrollToAdvantages = () => {
    const el = document.getElementById('advantages');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#101619] text-slate-900 dark:text-white antialiased font-sans transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* --- Hero Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6 pb-12 items-center">
          <div className="hero-content">
            <div className="inline-flex items-center gap-2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-3 py-1.5 rounded-full mb-5">
              <div className="w-2 h-2 bg-[#00e676] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-[#00e5ff] tracking-widest uppercase">Live Availability Tracking</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5 text-slate-950 dark:text-white">
              Powering Your <br />
              <span className="bg-gradient-to-b from-[#00b4d8] to-[#00e676] bg-clip-text text-transparent">Journey,</span> One <br />
              Slot at a Time
            </h1>
            
            <p className="text-slate-600 dark:text-[#8e9fa7] text-base max-w-[480px] mb-8 leading-relaxed">
              Experience seamless EV charging with real-time station discovery and instant slot booking. Join the green revolution with the world&apos;s smartest charging network.
            </p>
            
            <div className="flex gap-4 mb-10">
              <button 
                type="button"
                onClick={handleFindStation}
                className="bg-[#00e5ff] hover:bg-[#00c2d6] text-black font-semibold text-sm px-7 py-3.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-cyan-500/10"
              >
                <MapPin size={16} /> Find a Station
              </button>
              <button 
                type="button"
                onClick={handleScrollToAdvantages}
                className="border border-slate-300 dark:border-[#233036] hover:border-slate-400 dark:hover:border-[#8e9fa7] text-slate-800 dark:text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-all cursor-pointer bg-white dark:bg-transparent"
              >
                How it works
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-9 h-9 rounded-full border-2 border-white dark:border-[#101619]" src="https://i.pravatar.cc/150?img=33" alt="Driver 1" />
                <img className="w-9 h-9 rounded-full border-2 border-white dark:border-[#101619]" src="https://i.pravatar.cc/150?img=47" alt="Driver 2" />
                <img className="w-9 h-9 rounded-full border-2 border-white dark:border-[#101619]" src="https://i.pravatar.cc/150?img=12" alt="Driver 3" />
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#101619] bg-slate-200 dark:bg-[#233036] flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-white z-10">
                  +2k
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5 text-emerald-500 dark:text-[#00e676] text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-slate-500 dark:text-[#8e9fa7] text-xs">50k+ Happy Drivers</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-transparent">
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200"
              alt="EV Charging Station" 
              className="w-full h-auto rounded-2xl block"
            />
            <div className="absolute bottom-8 left-8 bg-slate-900/80 dark:bg-[#151d21]/70 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 w-56">
              <div className="w-10 h-10 bg-[#00e676]/15 rounded-lg flex items-center justify-center text-[#00e676]">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <span className="text-slate-300 dark:text-[#8e9fa7] text-[11px] block mb-1">Station HP-42</span>
                <span className="text-white text-sm font-semibold block mb-1.5">80% Charged</span>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-[#00e676]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="border-t border-b border-slate-200 dark:border-[#233036] py-10 my-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] rounded-xl flex items-center justify-center text-cyan-600 dark:text-[#00e5ff] shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">2,500+</h3>
              <p className="text-slate-500 dark:text-[#8e9fa7] text-xs">Active Stations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] rounded-xl flex items-center justify-center text-emerald-500 dark:text-[#00e676] shadow-sm">
              <Leaf size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">120 Tons</h3>
              <p className="text-slate-500 dark:text-[#8e9fa7] text-xs">CO2 Saved Yearly</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] rounded-xl flex items-center justify-center text-cyan-600 dark:text-[#00e5ff] shadow-sm">
              <Gauge size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">15 Mins</h3>
              <p className="text-slate-500 dark:text-[#8e9fa7] text-xs">Avg Charge Time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] rounded-xl flex items-center justify-center text-emerald-500 dark:text-[#00e676] shadow-sm">
              <CircleDollarSign size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Zero</h3>
              <p className="text-slate-500 dark:text-[#8e9fa7] text-xs">Hidden Booking Fees</p>
            </div>
          </div>
        </section>

        {/* --- Advantages Section --- */}
        <section id="advantages" className="text-center pb-16 pt-4">
          <div className="text-cyan-600 dark:text-[#00e5ff] text-xs font-bold tracking-[2px] uppercase mb-4">Our Advantages</div>
          <h2 className="text-4xl font-bold mb-5 text-slate-950 dark:text-white">Smart Charging Made Simple</h2>
          <p className="text-slate-600 dark:text-[#8e9fa7] text-sm max-w-[600px] mx-auto mb-16">
            Our platform provides the most reliable network for your electric vehicle needs with cutting-edge technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] p-8 rounded-2xl hover:-translate-y-1 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 text-cyan-600 dark:text-[#00e5ff] flex items-center justify-center mb-6">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Real-time Availability</h3>
              <p className="text-slate-600 dark:text-[#8e9fa7] text-sm leading-relaxed">Check slot status instantly before you arrive. No more waiting in lines or searching for empty plugs.</p>
            </div>
            <div className="bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] p-8 rounded-2xl hover:-translate-y-1 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00e676]/10 text-emerald-600 dark:text-[#00e676] flex items-center justify-center mb-6">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Ultra Fast Charging</h3>
              <p className="text-slate-600 dark:text-[#8e9fa7] text-sm leading-relaxed">Access high-speed 350kW charging points across the city that get you back on the road in minutes.</p>
            </div>
            <div className="bg-white dark:bg-[#151d21] border border-slate-200 dark:border-[#233036] p-8 rounded-2xl hover:-translate-y-1 transition-transform shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 text-cyan-600 dark:text-[#00e5ff] flex items-center justify-center mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Secure Payments</h3>
              <p className="text-slate-600 dark:text-[#8e9fa7] text-sm leading-relaxed">Seamless and secure digital payment options including Apple Pay, Google Pay, and UPI Escrow.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;