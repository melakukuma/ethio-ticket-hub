import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { EventCard } from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const { events } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];

  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-indigo-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" /> 
              Harmony Event and Promotion
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight">
              {t.home.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed opacity-90 font-medium">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 text-lg font-black shadow-2xl shadow-white/10">
                  {t.home.viewAll}
                </Button>
              </Link>
              <Link to="/my-tickets">
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 text-lg font-black">
                  {t.nav.myTickets}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0 z-10 hidden lg:block">
           <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                 <p className="text-4xl font-black text-white">10k+</p>
                 <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Happy Guests</p>
              </div>
              <div className="text-center border-x border-white/10">
                 <p className="text-4xl font-black text-white">50+</p>
                 <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Active Events</p>
              </div>
              <div className="text-center">
                 <p className="text-4xl font-black text-white">100%</p>
                 <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Secure Payment</p>
              </div>
           </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900">{t.home.upcomingEvents}</h2>
              <div className="h-1.5 w-24 bg-indigo-600 rounded-full" />
            </div>
            <Link to="/events" className="hidden sm:flex items-center text-indigo-600 font-black group">
              {t.home.viewAll}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-indigo-600 rounded-[40px] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-white mb-2">Special Kids Section</h3>
                    <p className="text-indigo-100 font-medium">Discover events tailored specifically for the little ones.</p>
                 </div>
                 <Link to="/kids">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl h-16 px-8 text-lg font-black">
                       Explore Kids Program
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};