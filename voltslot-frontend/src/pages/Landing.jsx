import { 
  Zap, 
  MapPin, 
  Leaf, 
  Gauge, 
  CircleDollarSign, 
  Clock, 
  ShieldCheck, 
  Send 
} from 'lucide-react';

function Landing() {
  return (
    <div className="min-h-screen bg-[#101619] text-white antialiased font-sans">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* --- Navbar --- */}
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Zap className="text-[#00e5ff]" size={24} fill="#00e5ff" />
            <span>EV Slot</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-sm font-medium text-[#8e9fa7] hover:text-white transition-colors">Stations</a>
            <a href="#" className="text-sm font-medium text-[#8e9fa7] hover:text-white transition-colors">Bookings</a>
            <a href="#" className="text-sm font-medium text-[#8e9fa7] hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-[#8e9fa7] hover:text-white transition-colors">Support</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="bg-[#00e5ff] hover:bg-[#00c2d6] text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
              Sign In
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-transparent overflow-hidden bg-[#ffecd2]">
              <img 
                src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* --- Hero Section --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-16 items-center">
          <div className="hero-content">
            <div className="inline-flex items-center gap-2 bg-[#00e5ff]/10 border border-[#00e5ff]/20 px-3 py-1.5 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#00e676] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-[#00e5ff] tracking-widest uppercase">Live Availability Tracking</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Powering Your <br />
              <span className="bg-gradient-to-b from-[#00e5ff] to-[#00e676] bg-clip-text text-transparent">Journey,</span> One <br />
              Slot at a Time
            </h1>
            
            <p className="text-[#8e9fa7] text-base max-w-[480px] mb-10 leading-relaxed">
              Experience seamless EV charging with real-time station discovery and instant slot booking. Join the green revolution with the world's smartest charging network.
            </p>
            
            <div className="flex gap-4 mb-12">
              <button className="bg-[#00e5ff] hover:bg-[#00c2d6] text-black font-semibold text-sm px-7 py-3.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                <MapPin size={16} /> Find a Station
              </button>
              <button className="border border-[#233036] hover:border-[#8e9fa7] text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-all cursor-pointer">
                How it works
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img className="w-9 h-9 rounded-full border-2 border-[#101619]" src="https://i.pravatar.cc/150?img=33" alt="Driver 1" />
                <img className="w-9 h-9 rounded-full border-2 border-[#101619]" src="https://i.pravatar.cc/150?img=47" alt="Driver 2" />
                <img className="w-9 h-9 rounded-full border-2 border-[#101619]" src="https://i.pravatar.cc/150?img=12" alt="Driver 3" />
                <div className="w-9 h-9 rounded-full border-2 border-[#101619] bg-[#233036] flex items-center justify-center text-[10px] font-bold text-white z-10">
                  +2k
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-0.5 text-[#00e676] text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-[#8e9fa7] text-xs">50k+ Happy Drivers</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.15)]">
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1200"
              alt="EV Charging Station" 
              className="w-full h-auto rounded-2xl block"
            />
            <div className="absolute bottom-8 left-8 bg-[#151d21]/70 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 w-56">
              <div className="w-10 h-10 bg-[#00e676]/15 rounded-lg flex items-center justify-center text-[#00e676]">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <span className="text-[#8e9fa7] text-[11px] block mb-1">Station HP-42</span>
                <span className="text-white text-sm font-semibold block mb-1.5">80% Charged</span>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-[#00e676]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="border-t border-b border-[#233036] py-10 my-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#151d21] border border-[#233036] rounded-xl flex items-center justify-center text-[#00e5ff]">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">2,500+</h3>
              <p className="text-[#8e9fa7] text-xs">Active Stations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#151d21] border border-[#233036] rounded-xl flex items-center justify-center text-[#00e676]">
              <Leaf size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">120 Tons</h3>
              <p className="text-[#8e9fa7] text-xs">CO2 Saved Yearly</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#151d21] border border-[#233036] rounded-xl flex items-center justify-center text-[#00e5ff]">
              <Gauge size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">15 Mins</h3>
              <p className="text-[#8e9fa7] text-xs">Avg Charge Time</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#151d21] border border-[#233036] rounded-xl flex items-center justify-center text-[#00e676]">
              <CircleDollarSign size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Zero</h3>
              <p className="text-[#8e9fa7] text-xs">Hidden Booking Fees</p>
            </div>
          </div>
        </section>

        {/* --- Advantages Section --- */}
        <section className="text-center pb-20">
          <div className="text-[#00e5ff] text-xs font-bold tracking-[2px] uppercase mb-4">Our Advantages</div>
          <h2 className="text-4xl font-bold mb-5">Smart Charging Made Simple</h2>
          <p className="text-[#8e9fa7] text-sm max-w-[600px] mx-auto mb-16">
            Our platform provides the most reliable network for your electric vehicle needs with cutting-edge technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#151d21] border border-[#233036] p-10 rounded-2xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center mb-6">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Availability</h3>
              <p className="text-[#8e9fa7] text-sm leading-relaxed">Check slot status instantly before you arrive. No more waiting in lines or searching for empty plugs.</p>
            </div>
            <div className="bg-[#151d21] border border-[#233036] p-10 rounded-2xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#00e676]/10 text-[#00e676] flex items-center justify-center mb-6">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Ultra Fast Charging</h3>
              <p className="text-[#8e9fa7] text-sm leading-relaxed">Access high-speed 350kW charging points across the city that get you back on the road in minutes.</p>
            </div>
            <div className="bg-[#151d21] border border-[#233036] p-10 rounded-2xl hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-[#8e9fa7] text-sm leading-relaxed">Seamless and secure digital payment options including Apple Pay, Google Pay, and Crypto.</p>
            </div>
          </div>
        </section>

        {/* --- Professional Footer --- */}
        <footer className="border-t border-[#233036] pt-16 pb-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xl font-bold">
                <Zap className="text-[#00e5ff]" size={24} fill="#00e5ff" />
                <span>EV Slot</span>
              </div>
              <p className="text-[#8e9fa7] text-sm leading-relaxed max-w-[300px]">
                Experience seamless EV charging with real-time station discovery and instant slot booking. The world's smartest charging network.
              </p>
              <div className="flex gap-3 mt-2">
                {/* Twitter SVG */}
                <a href="#" className="w-9 h-9 rounded-full bg-[#151d21] border border-[#233036] flex items-center justify-center text-[#8e9fa7] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn SVG */}
                <a href="#" className="w-9 h-9 rounded-full bg-[#151d21] border border-[#233036] flex items-center justify-center text-[#8e9fa7] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* Instagram SVG */}
                <a href="#" className="w-9 h-9 rounded-full bg-[#151d21] border border-[#233036] flex items-center justify-center text-[#8e9fa7] hover:text-[#00e5ff] hover:border-[#00e5ff] hover:bg-[#00e5ff]/10 transition-all">
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" h="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-base mb-2">Product</h4>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Find Stations</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Pricing</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Mobile App</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Features</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-base mb-2">Company</h4>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">About Us</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Careers</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Press</a>
              <a href="#" className="text-[#8e9fa7] text-sm hover:text-[#00e5ff] hover:pl-1 transition-all">Contact</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-base mb-1">Stay Updated</h4>
              <p className="text-[#8e9fa7] text-sm">Get the latest news on EV charging and our network expansion.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-[#151d21] border border-[#233036] px-4 py-2.5 rounded-lg text-sm text-white outline-none focus:border-[#00e5ff] transition-colors"
                  required 
                />
                <button type="submit" className="bg-[#00e5ff] hover:bg-[#00c2d6] text-black w-11 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* --- BRAND NEW ACCENT CARD: Neon Vehicle Feature Banner --- */}
          <div className="w-full mb-12 rounded-xl overflow-hidden relative group border border-[#00e5ff]/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#151d21] via-transparent to-[#101619]/80 z-10 mix-blend-multiply"></div>
            <img 
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200" 
              alt="Neon Blue EV" 
              className="w-full h-48 object-cover filter brightness-[0.6] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 z-20">
              <span className="text-[#00e5ff] font-bold text-[10px] tracking-widest uppercase mb-1">VoltSlot Ecosystem</span>
              <h3 className="text-xl font-bold tracking-tight text-white mb-1">Ready to upgrade your commute grid?</h3>
              <p className="text-[#8e9fa7] text-xs max-w-md">Connect your smart vehicle profile today to auto-allocate high-efficiency premium plugs nearest to you.</p>
            </div>
          </div>
          
          <div className="border-t border-[#233036] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#8e9fa7] text-xs">
            <p>© 2026 EV Slot Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default Landing;