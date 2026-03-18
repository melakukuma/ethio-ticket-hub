import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  location: string;
  locationName: string;
  price: number;
  ticketsLeft: number;
  totalTickets: number;
  soldTickets: number;
  image: string;
  poster?: string;
  category: 'Concert' | 'Workshop' | 'Kids' | 'Other' | 'Music' | 'Business' | 'Art';
  lat: number;
  lng: number;
  isKidsProgram?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  purchaseDate: string;
  qrCode: string; // This will be the unique ticket ID used for scanning
}

interface AppContextType {
  events: Event[];
  tickets: Ticket[];
  addEvent: (event: Omit<Event, 'id' | 'soldTickets'>) => void;
  buyTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'purchaseDate' | 'qrCode'>) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Ethio-Jazz Night',
    description: 'A soulful night of authentic Ethiopian jazz with local legends.',
    shortDescription: 'Soulful night of authentic Ethiopian jazz.',
    fullDescription: 'Join us for an unforgettable evening of Ethio-jazz, featuring the legendary performers from Addis Ababa. The night will be filled with soulful melodies, rhythmic beats, and the rich cultural heritage of Ethiopia.',
    date: '2026-05-15',
    location: 'Addis Ababa, Piazza',
    locationName: 'Ghion Hotel Garden',
    price: 500,
    ticketsLeft: 200,
    totalTickets: 250,
    soldTickets: 50,
    category: 'Concert',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/ethio-jazz-night-poster-d4f4fc07-1773832425500.webp',
    poster: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/ethio-jazz-night-poster-d4f4fc07-1773832425500.webp',
    lat: 9.0215,
    lng: 38.7516,
  },
  {
    id: '2',
    title: 'Harmony Kids Festival',
    description: 'A day of fun, games, and learning for children of all ages.',
    shortDescription: 'Day of fun, games, and learning for children.',
    fullDescription: 'Bring your little ones for a day packed with excitement! From bouncy castles to face painting, educational workshops to magic shows, the Harmony Kids Festival is the perfect family outing.',
    date: '2026-06-01',
    location: 'Addis Ababa, Bole',
    locationName: 'Bole Park',
    price: 200,
    ticketsLeft: 500,
    totalTickets: 600,
    soldTickets: 100,
    category: 'Kids',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/harmony-kids-festival-poster-14120f96-1773832425984.webp',
    poster: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/harmony-kids-festival-poster-14120f96-1773832425984.webp',
    lat: 8.995,
    lng: 38.785,
    isKidsProgram: true
  },
  {
    id: '3',
    title: 'Tech Innovation Summit',
    description: 'The biggest gathering of tech enthusiasts and entrepreneurs in Ethiopia.',
    shortDescription: 'Biggest gathering of tech enthusiasts in Ethiopia.',
    fullDescription: 'Explore the future of technology in Africa. Network with industry leaders, attend inspiring keynotes, and discover the latest innovations that are shaping the digital landscape of Ethiopia.',
    date: '2026-07-20',
    location: 'Addis Ababa, Kazanchis',
    locationName: 'ECA Conference Center',
    price: 1500,
    ticketsLeft: 100,
    totalTickets: 150,
    soldTickets: 50,
    category: 'Workshop',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/tech-innovation-summit-poster-9af26283-1773832425197.webp',
    poster: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/8688849d-ddf3-4d9e-aba8-516c0aee42b5/tech-innovation-summit-poster-9af26283-1773832425197.webp',
    lat: 9.015,
    lng: 38.765,
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('harmony_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('harmony_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('harmony_isAdmin') === 'true';
  });

  const [adminUsername] = useState('12345678');
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('harmony_adminPassword') || '12345678';
  });

  useEffect(() => {
    localStorage.setItem('harmony_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('harmony_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('harmony_adminPassword', adminPassword);
  }, [adminPassword]);

  const addEvent = (event: Omit<Event, 'id' | 'soldTickets'>) => {
    const newEvent: Event = { 
      ...event, 
      id: Date.now().toString(),
      soldTickets: 0
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const buyTicket = (ticketData: Omit<Ticket, 'id' | 'status' | 'purchaseDate' | 'qrCode'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'pending',
      purchaseDate: new Date().toISOString(),
      qrCode: Math.random().toString(36).substring(2, 15).toUpperCase(), // Secret scanning code
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const loginAdmin = (user: string, pass: string) => {
    if (user === adminUsername && pass === adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('harmony_isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('harmony_isAdmin');
  };

  const changeAdminPassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  return (
    <AppContext.Provider value={{
      events,
      tickets,
      addEvent,
      buyTicket,
      updateTicketStatus,
      isAdmin,
      setIsAdmin,
      loginAdmin,
      logoutAdmin,
      changeAdminPassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};