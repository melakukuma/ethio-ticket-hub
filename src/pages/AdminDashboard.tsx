import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Users, BarChart3, QrCode, ExternalLink, 
  Calendar, DollarSign, Clock, Settings, LogOut, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext, Event } from '../context/AppContext';
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

  // ✅ FIXED STATE (added missing fields)
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
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
    category: 'Other',
    lat: 9.0215,
    lng: 38.7516,
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();

    addEvent({
      ...newEvent,
      totalTickets: newEvent.ticketsLeft, // ✅ auto set
    });

    toast.success("Event created successfully!");

    // ✅ RESET FIXED
    setNewEvent({
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

    changeAdminPassword(passwordForm.newPassword);
    toast.success("Password updated!");

    setPasswordForm({ newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const pendingTickets = tickets.filter(t => t.status === 'pending');
  const totalSales = tickets.filter(t => t.status === 'approved')
    .reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <header className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">{t.admin.dashboard}</h1>

        <div className="flex gap-3">
          <Button asChild>
            <Link to="/admin/scanner">
              <QrCode className="mr-2 h-4 w-4" />
              Scanner
            </Link>
          </Button>

          <Button variant="outline" onClick={() => toast.info("Coming soon")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Report
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card><CardContent>Total: {totalSales} ETB</CardContent></Card>
        <Card><CardContent>Events: {events.length}</CardContent></Card>
        <Card><CardContent>Pending: {pendingTickets.length}</CardContent></Card>
        <Card><CardContent>Buyers: {tickets.length}</CardContent></Card>
      </div>

      {/* TABS */}
      <Tabs defaultValue="verify">

        <TabsList>
          <TabsTrigger value="verify">Verify</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* VERIFY */}
        <TabsContent value="verify">
          {pendingTickets.map(ticket => (
            <Card key={ticket.id} className="mb-3 p-4">
              <p>{ticket.userName} - {ticket.totalAmount} ETB</p>

              <div className="flex gap-2 mt-2">
                <Button onClick={() => updateTicketStatus(ticket.id, 'approved')}>
                  Approve
                </Button>

                <Button variant="destructive"
                  onClick={() => updateTicketStatus(ticket.id, 'rejected')}>
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* CREATE EVENT */}
        <TabsContent value="create">
          <form onSubmit={handleCreateEvent} className="space-y-4">

            <Input placeholder="Title"
              value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
            />

            {/* ✅ FIXED SHORT DESCRIPTION */}
            <Input placeholder="Short Description"
              value={newEvent.shortDescription}
              onChange={e => setNewEvent({...newEvent, shortDescription: e.target.value})}
            />

            <Textarea placeholder="Full Description"
              value={newEvent.fullDescription}
              onChange={e => setNewEvent({...newEvent, fullDescription: e.target.value})}
            />

            <Input type="number" placeholder="Price"
              value={newEvent.price}
              onChange={e => setNewEvent({...newEvent, price: Number(e.target.value)})}
            />

            <Input type="number" placeholder="Tickets"
              value={newEvent.ticketsLeft}
              onChange={e => setNewEvent({...newEvent, ticketsLeft: Number(e.target.value)})}
            />

            <Button type="submit">Create Event</Button>
          </form>
        </TabsContent>

        {/* BUYERS */}
        <TabsContent value="buyers">
          {tickets.map(ticket => (
            <Card key={ticket.id} className="mb-2 p-3">
              {ticket.userName} - {ticket.status}
            </Card>
          ))}
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="settings">
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Input type="password" placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
            />

            <Input type="password" placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            />

            <Button type="submit">Change Password</Button>
          </form>
        </TabsContent>

      </Tabs>
    </div>
  );
};