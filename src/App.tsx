import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { BuyTicket } from './pages/BuyTicket';
import { MyTickets } from './pages/MyTickets';
import { AdminDashboard } from './pages/AdminDashboard';
import { QRScannerPage } from './pages/QRScannerPage';
import { KidsEvents } from './pages/KidsEvents';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event-details/:id" element={<EventDetails />} />
                <Route path="/buy-ticket/:id" element={<BuyTicket />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/kids-events" element={<KidsEvents />} />
                
                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/qr-scanner" element={<QRScannerPage />} />
                </Route>

                {/* Redirects */}
                <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
              </Routes>
            </main>
            <Toaster position="top-center" richColors />
          </div>
        </AppProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;