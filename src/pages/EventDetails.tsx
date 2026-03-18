import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { Calendar, MapPin, Ticket, ChevronLeft, Share2, Map as MapIcon, Info, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const EventDetails: React.FC = () => {
  const { id } = useParams();
  const { events } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  
  const event = events.find(e => e.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const staticMapUrl = `https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          {t.common.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="relative h-64 sm:h-96">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="secondary" className="bg-white/90 rounded-full shadow-lg" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 sm:p-10">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                    {event.category}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 mr-4">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{t.eventDetails.date}</p>
                      <p className="text-gray-900 font-bold">
                        {new Date(event.date).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" /> 7:00 PM - 11:00 PM
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0 mr-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{t.eventDetails.location}</p>
                      <p className="text-gray-900 font-bold">{event.locationName}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-indigo max-w-none">
                  <h3 className="text-xl font-bold flex items-center mb-4">
                    <Info className="w-5 h-5 mr-2 text-indigo-600" />
                    {t.eventDetails.description}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {event.fullDescription}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-bold flex items-center mb-6">
                <MapIcon className="w-5 h-5 mr-2 text-indigo-600" />
                {t.eventDetails.map}
              </h3>
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative group">
                <img 
                  src={staticMapUrl} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  alt="Map" 
                />
                <div className="absolute inset-0 bg-black/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="secondary" className="shadow-xl bg-white/90 backdrop-blur-sm rounded-full">
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-2 rounded-lg text-xs font-bold shadow-lg">
                  GPS: {event.lat}, {event.lng}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / Ticket Box */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-50 sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6">Reservation</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">{t.eventDetails.price}</span>
                  <span className="text-2xl font-black text-indigo-600">{event.price} ETB</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                  <span className="text-gray-500">Available Tickets</span>
                  <span className={cn(
                    "font-bold",
                    event.ticketsLeft < 50 ? "text-red-500" : "text-green-600"
                  )}>
                    {event.ticketsLeft} / {event.totalTickets}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                  <Users className="w-4 h-4 mr-2 text-indigo-400" />
                  Group bookings available for 10+ people.
                </div>
              </div>

              <Link to={`/buy-ticket/${event.id}`}>
                <Button 
                  className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  disabled={event.ticketsLeft === 0}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {event.ticketsLeft === 0 ? 'SOLD OUT' : t.eventDetails.buyTicket}
                </Button>
              </Link>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                No hidden fees. Instant QR generation after approval.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};