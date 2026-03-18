import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { EventCard } from '../components/EventCard';
import { motion } from 'framer-motion';
import { Sparkles, Baby, PartyPopper } from 'lucide-react';

export const KidsEvents: React.FC = () => {
  const { events } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];

  const kidsEvents = events.filter(event => event.category === 'Kids');

  return (
    <div className="min-h-screen bg-pink-50/30 pb-20">
      <section className="relative py-20 bg-pink-500 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/30">
              <Baby className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Kids Program</h1>
            <p className="text-pink-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Magical experiences designed for curiosity and fun. Safe, engaging, and unforgettable events for children.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {kidsEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {kidsEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-pink-100">
            <PartyPopper className="w-16 h-16 text-pink-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">New kids events coming soon!</h2>
            <p className="text-gray-500 mt-2">Stay tuned for our upcoming magical adventures.</p>
          </div>
        )}

        <div className="mt-20 bg-white p-10 rounded-[40px] border border-pink-100 shadow-sm">
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                 <h3 className="text-3xl font-black text-gray-900 mb-4">Why Choose Our Kids Programs?</h3>
                 <ul className="space-y-4">
                    {[
                      { title: 'Safety First', desc: 'All venues are vetted for child safety and secure access.' },
                      { title: 'Expert Supervision', desc: 'Professional staff experienced in working with children.' },
                      { title: 'Creative Learning', desc: 'Events designed to spark imagination and skill development.' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                         <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shrink-0 mt-1">
                            <Sparkles className="w-3 h-3" />
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                         </div>
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="md:w-1/2 h-64 rounded-3xl overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Kids playing"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};