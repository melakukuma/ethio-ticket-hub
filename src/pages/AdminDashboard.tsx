import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Users, BarChart3, QrCode, ExternalLink, Calendar, Clock, DollarSign, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext, Event, Ticket } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { validateTransactionId, cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { events, tickets, addEvent, updateTicketStatus, logoutAdmin, changeAdminPassword } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    shortDescription: '',
    fullDescription: '',
    date: '',
    location: '',
    locationName: '',
    price: 0,
    ticketsLeft: 0,
    totalTickets: 0,
    soldTickets: 0,
    image: '',
    category: 'Other',
    lat: 9.03,
    lng: 38.75,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(newEvent);
    toast.success("Event created successfully!");
    setNewEvent({
      title: '',
      description: '',
      shortDescription: '',   // ✅ required
      fullDescription: '',
      date: '',
      location: '',
      locationName: '',
      price: 0,
      ticketsLeft: 0,
      totalTickets: 0,
      soldTickets: 0,         // ✅ required
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
      category: 'Other',
      lat: 9.0215,
      lng: 38.7516,
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    changeAdminPassword(passwordForm.newPassword);
    toast.success("Password updated successfully!");
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.info("Logged out successfully");
    navigate('/admin/login');
  };

  const pendingTickets = tickets.filter(t => t.status === 'pending');
  const totalSales = tickets.filter(t => t.status === 'approved').reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900">{t.admin.dashboard}</h1>
          <p className="text-gray-500">Welcome back, Admin. Here is what's happening with your events.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl" asChild>
            <Link to="/admin/scanner">
              <QrCode className="mr-2 h-4 w-4" /> {t.admin.qrScanner}
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-gray-200" onClick={() => toast.info("Generating sales report...")}>
            <BarChart3 className="mr-2 h-4 w-4" /> {t.admin.salesReport}
          </Button>
          <Button variant="ghost" className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> {t.admin.logout}
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: `${totalSales} ETB`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
          { label: 'Active Events', value: events.length, icon: Calendar, color: 'bg-indigo-100 text-indigo-600' },
          { label: 'Pending Approvals', value: pendingTickets.length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { label: 'Total Buyers', value: tickets.length, icon: Users, color: 'bg-purple-100 text-purple-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="verify" className="space-y-8">
        <TabsList className="bg-gray-100 p-1 rounded-xl w-full max-w-2xl">
          <TabsTrigger value="verify" className="rounded-lg flex-1 font-bold">{t.admin.verify}</TabsTrigger>
          <TabsTrigger value="create" className="rounded-lg flex-1 font-bold">{t.admin.createEvent}</TabsTrigger>
          <TabsTrigger value="buyers" className="rounded-lg flex-1 font-bold">{t.admin.buyers || "Buyers"}</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg flex-1 font-bold"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
        </TabsList>

        {/* Create Event */}
        <TabsContent value="create">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-indigo-600 text-white p-8">
              <CardTitle className="text-2xl font-black">{t.admin.createEvent}</CardTitle>
              <CardDescription className="text-indigo-100">Add a new event to Harmony's platform</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Label>Title</Label>
                  <Input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="h-12 rounded-xl" />
                  <Label>Short Description</Label>
                  <Input value={newEvent.shortDescription} onChange={e => setNewEvent({...newEvent, shortDescription: e.target.value})} className="h-12 rounded-xl" />
                  <Label>Full Description</Label>
                  <Textarea value={newEvent.fullDescription} onChange={e => setNewEvent({...newEvent, fullDescription: e.target.value})} className="min-h-[120px] rounded-xl" />
                  <Label>Category</Label>
                  <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value as any})} className="h-12 w-full rounded-xl border px-3">
                    <option value="Concert">Concert</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Kids">Kids</option>
                    <option value="Other">Other</option>
                  </select>
                  <Label>Date</Label>
                  <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="h-12 rounded-xl" />
                  <Label>Location Name</Label>
                  <Input value={newEvent.locationName} onChange={e => setNewEvent({...newEvent, locationName: e.target.value})} className="h-12 rounded-xl" />
                  <Label>City/Address</Label>
                  <Input value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="h-12 rounded-xl" />
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={newEvent.lat} onChange={e => setNewEvent({...newEvent, lat: Number(e.target.value)})} className="h-12 rounded-xl" />
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={newEvent.lng} onChange={e => setNewEvent({...newEvent, lng: Number(e.target.value)})} className="h-12 rounded-xl" />
                  <Label>Price (ETB)</Label>
                  <Input type="number" value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: Number(e.target.value)})} className="h-12 rounded-xl" />
                  <Label>Tickets Left</Label>
                  <Input type="number" value={newEvent.ticketsLeft} onChange={e => setNewEvent({...newEvent, ticketsLeft: Number(e.target.value)})} className="h-12 rounded-xl" />
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg">Save Event</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};