import React, { useState } from 'react';
import { 
  LayoutDashboard, PlusCircle, CheckCircle2, XCircle, Users, 
  BarChart3, QrCode, ExternalLink, Calendar, MapPin, 
  DollarSign, Package, Clock, Settings, LogOut, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  const { 
    events, tickets, addEvent, updateTicketStatus, 
    logoutAdmin, changeAdminPassword 
  } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    location: '',
    locationName: '',
    price: 0,
    ticketsLeft: 0,
    totalTickets: 0,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop',
    category: 'Other',
    lat: 9.0215,
    lng: 38.7516,
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
      fullDescription: '',
      date: '',
      location: '',
      locationName: '',
      price: 0,
      ticketsLeft: 0,
      totalTickets: 0,
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

      {/* Stats Overview */}
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

      <Tabs defaultValue="verify" className="space-y-8">
        <TabsList className="bg-gray-100 p-1 rounded-xl w-full max-w-2xl">
          <TabsTrigger value="verify" className="rounded-lg flex-1 font-bold">{t.admin.verify}</TabsTrigger>
          <TabsTrigger value="create" className="rounded-lg flex-1 font-bold">{t.admin.createEvent}</TabsTrigger>
          <TabsTrigger value="buyers" className="rounded-lg flex-1 font-bold">{t.admin.buyers || "Buyers"}</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg flex-1 font-bold"><Settings className="w-4 h-4 mr-1" /> Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="verify">
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Pending Verifications
            </h2>
            
            {pendingTickets.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                 <p className="text-gray-400 font-medium">No pending transactions to verify.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden border-2 border-gray-50 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex gap-4">
                           <div className="w-16 h-16 bg-gray-50 rounded-2xl border flex flex-col items-center justify-center text-gray-400">
                             <span className="text-[10px] font-bold uppercase">Ticket</span>
                             <span className="font-black text-indigo-600">{ticket.quantity}</span>
                           </div>
                           <div className="space-y-1">
                             <h3 className="font-black text-lg text-gray-900">{ticket.userName}</h3>
                             <p className="text-sm text-gray-500">{ticket.eventTitle} \\u2022 {ticket.totalAmount} ETB</p>
                             <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                <span>{ticket.paymentMethod}</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{ticket.transactionId}</span>
                             </div>
                           </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                           <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold"
                            asChild
                           >
                             <a 
                              href={validateTransactionId(ticket.paymentMethod, ticket.transactionId) || '#'}
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center"
                             >
                               {ticket.paymentMethod === 'Telebirr' ? t.admin.checkTelebirr : 
                                ticket.paymentMethod === 'M-Pesa' ? "Verify M-Pesa" : 
                                t.admin.checkCBE}
                               <ExternalLink className="ml-2 h-3 w-3" />
                             </a>
                           </Button>
                           <Button 
                            onClick={() => updateTicketStatus(ticket.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
                           >
                             {t.admin.approve}
                           </Button>
                           <Button 
                            variant="ghost" 
                            onClick={() => updateTicketStatus(ticket.id, 'rejected')}
                            className="text-red-500 hover:bg-red-50 rounded-lg font-bold"
                           >
                             {t.admin.reject}
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-indigo-600 text-white p-8">
              <CardTitle className="text-2xl font-black">{t.admin.createEvent}</CardTitle>
              <CardDescription className="text-indigo-100">Add a new event to Harmony's platform</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t.admin.eventTitle}</Label>
                    <Input 
                      required
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.admin.eventDesc} (Short)</Label>
                    <Input 
                      required
                      value={newEvent.description}
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Description</Label>
                    <Textarea 
                      required
                      value={newEvent.fullDescription}
                      onChange={e => setNewEvent({...newEvent, fullDescription: e.target.value})}
                      className="min-h-[120px] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.admin.eventPrice} (ETB)</Label>
                      <Input 
                        type="number"
                        required
                        value={newEvent.price}
                        onChange={e => setNewEvent({...newEvent, price: Number(e.target.value)})}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.admin.eventStock}</Label>
                      <Input 
                        type="number"
                        required
                        value={newEvent.ticketsLeft}
                        onChange={e => setNewEvent({...newEvent, ticketsLeft: Number(e.target.value)})}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Event Category</Label>
                    <select 
                      className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value as any})}
                    >
                      <option value="Concert">Concert</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Kids">Kids</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Event Date</Label>
                    <Input 
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.admin.eventLocationName}</Label>
                    <Input 
                      required
                      placeholder="Venue Name"
                      value={newEvent.locationName}
                      onChange={e => setNewEvent({...newEvent, locationName: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address/City</Label>
                    <Input 
                      required
                      placeholder="City, Area"
                      value={newEvent.location}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t.admin.eventLat}</Label>
                      <Input 
                        type="number" step="any"
                        value={newEvent.lat}
                        onChange={e => setNewEvent({...newEvent, lat: Number(e.target.value)})}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.admin.eventLng}</Label>
                      <Input 
                        type="number" step="any"
                        value={newEvent.lng}
                        onChange={e => setNewEvent({...newEvent, lng: Number(e.target.value)})}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg">
                    {t.admin.saveEvent}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyers">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50 border-b">
                     <tr>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Buyer</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {tickets.map(ticket => (
                       <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{ticket.userName}</div>
                            <div className="text-xs text-gray-500">{ticket.userPhone}</div>
                         </td>
                         <td className="px-6 py-4 font-medium text-gray-600">{ticket.eventTitle}</td>
                         <td className="px-6 py-4 font-bold">{ticket.quantity}</td>
                         <td className="px-6 py-4 font-black text-indigo-600">{ticket.totalAmount} ETB</td>
                         <td className="px-6 py-4">
                            <Badge variant="outline" className={cn(
                              "font-bold uppercase tracking-widest text-[10px]",
                              ticket.status === 'approved' ? "text-green-600 border-green-200 bg-green-50" : 
                              ticket.status === 'pending' ? "text-yellow-600 border-yellow-200 bg-yellow-50" : 
                              "text-red-600 border-red-200 bg-red-50"
                            )}>
                              {ticket.status}
                            </Badge>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gray-900 text-white p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-indigo-400" /> 
                System Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your administrator account security</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-md">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input 
                      type="password" 
                      required
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input 
                      type="password" 
                      required
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 font-bold">
                    Update Password
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};