import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Events: React.FC = () => {
  const { events } = useAppContext();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Concert', 'Workshop', 'Kids', 'Other'];

  const filteredEvents = useMemo(() => {
    return (events || []).filter(event => {
      if (!event) return false;
      const title = String(event.title || '');
      const locationName = String(event.locationName || event.location || '');
      const search = (searchTerm || '').toLowerCase();
      
      const matchesSearch = title.toLowerCase().includes(search) || 
                           locationName.toLowerCase().includes(search);
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t?.events?.title || 'Events'}</h1>
          <p className="text-indigo-200 text-lg max-w-2xl">
            Find your next adventure. Browse through our curated list of the best events happening in town.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filters Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 border border-gray-100 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by event name or venue..."
                className="pl-12 h-14 bg-gray-50 border-none rounded-2xl text-lg focus-visible:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                    selectedCategory === cat 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {cat === 'all' ? (t?.events?.all || 'All') : (t?.events?.[(cat || '').toLowerCase() as keyof typeof t.events] || cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t?.events?.noEvents || 'No events found'}</h2>
            <Button 
              variant="link" 
              className="text-indigo-600 font-bold mt-2" 
              onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Events: React.FC = () => {
  return <div>Events Page</div>;
};

export default Events;
