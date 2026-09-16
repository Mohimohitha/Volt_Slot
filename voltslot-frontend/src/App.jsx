import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Stations from './pages/Stations';
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';
import VehicleOnboardingModal from './components/VehicleOnboardingModal';
import BookingModal from './components/BookingModal';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

function GlobalToastBanner() {
  const { activeToast, dismissToast } = useNotifications();
  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="px-4 py-3.5 rounded-2xl shadow-2xl border flex items-start gap-3 text-xs font-mono max-w-sm bg-[#0a1217]/95 text-white border-[#00e5ff]/40 backdrop-blur-md">
        {activeToast.type === 'refund' ? (
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-[#00e676] shrink-0 mt-0.5">
            <RotateCcw size={16} />
          </div>
        ) : (
          <div className="p-1.5 rounded-lg bg-[#00e5ff]/20 text-[#00e5ff] shrink-0 mt-0.5">
            <CheckCircle2 size={16} />
          </div>
        )}
        <div className="flex-1 space-y-0.5">
          <div className="font-bold text-white tracking-wide">{activeToast.title}</div>
          <div className="text-slate-300 text-[11px] leading-relaxed">{activeToast.message}</div>
        </div>
        <button onClick={dismissToast} className="text-slate-400 hover:text-white cursor-pointer p-0.5">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, login } = useAuth();
  const { addNotification } = useNotifications();

  const [currentPage, setCurrentPage] = useState(() => {
    const savedToken = localStorage.getItem('voltslot_token');
    const savedPage = localStorage.getItem('voltslot_current_page');
    if (savedToken && savedPage) return savedPage;
    if (savedToken) return 'dashboard';
    return 'landing';
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeVehicleProfile, setActiveVehicleProfile] = useState(null);
  const [selectedStationForBooking, setSelectedStationForBooking] = useState(null);
  const [refreshDashboardTrigger, setRefreshDashboardTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('voltslot_current_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (user) {
      const userKey = `voltslot_vehicle_${user.id || user._id || user.email}`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        setActiveVehicleProfile(JSON.parse(saved));
        setShowOnboarding(false);
      } else {
        setActiveVehicleProfile(null);
        setShowOnboarding(true);
      }
    } else {
      setActiveVehicleProfile(null);
      setShowOnboarding(false);
      const protectedPages = ['dashboard', 'my-bookings', 'stations', 'notifications'];
      if (protectedPages.includes(currentPage)) {
        setCurrentPage('landing');
      }
    }
  }, [user]);

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    setCurrentPage('dashboard');

    const userKey = `voltslot_vehicle_${userData.id || userData._id || userData.email}`;
    const saved = localStorage.getItem(userKey);
    if (!saved) {
      setShowOnboarding(true);
    } else {
      setActiveVehicleProfile(JSON.parse(saved));
      setShowOnboarding(false);
    }
  };

  const handleOnboardingComplete = (newProfile) => {
    setActiveVehicleProfile(newProfile);
    setShowOnboarding(false);
  };

  if (currentPage === 'signup') {
    return <SignUp onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'signin') {
    return (
      <SignIn
        onNavigate={(page) => setCurrentPage(page)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b0e] text-slate-900 dark:text-white flex flex-col transition-colors">
      <Navbar onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />
      
      <main className="flex-1">
        {currentPage === 'landing' && (
          <Landing onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'dashboard' && user && (
          <Dashboard
            key={refreshDashboardTrigger}
            onNavigate={(page) => setCurrentPage(page)}
            vehicleProfile={activeVehicleProfile}
            onOpenVehicleSetup={() => setShowOnboarding(true)}
            onBookSlot={(station) => setSelectedStationForBooking(station)}
          />
        )}

        {currentPage === 'stations' && user && (
          <Stations
            vehicleProfile={activeVehicleProfile}
            onBookSlot={(station) => setSelectedStationForBooking(station)}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'my-bookings' && user && (
          <MyBookings onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'notifications' && user && (
          <Notifications onNavigate={(page) => setCurrentPage(page)} />
        )}
      </main>

      <Footer onNavigate={(page) => setCurrentPage(page)} />

      {/* Global In-App Toast */}
      <GlobalToastBanner />

      {/* Vehicle Configuration */}
      {user && (
        <VehicleOnboardingModal
          isOpen={showOnboarding}
          user={user}
          currentProfile={activeVehicleProfile}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Slot Booking & Payment Modal */}
      {selectedStationForBooking && (
        <BookingModal
          station={selectedStationForBooking}
          vehicleProfile={activeVehicleProfile}
          onClose={() => setSelectedStationForBooking(null)}
          onBookingSuccess={(reservation) => {
            setSelectedStationForBooking(null);
            
            // Dispatch Booking Success Notification
            addNotification({
              title: 'Booking Confirmed',
              message: `Your EV charging slot at ${selectedStationForBooking.name} (Bay #${reservation.bayNumber}) has been booked successfully. Amount Paid: ₹${reservation.amountPaid}.`,
              type: 'success'
            });

            setRefreshDashboardTrigger((prev) => prev + 1);
            setCurrentPage('dashboard');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}