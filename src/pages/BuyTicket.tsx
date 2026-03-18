import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Ticket, ArrowRight, CreditCard, Landmark, Smartphone, Info, ChevronLeft, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const BuyTicket: React.FC = () => {
  const { id } = useParams();
  const { events, buyTicket } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const event = events.find(e => e.id === id);

  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    quantity: 1,
    paymentMethod: 'Telebirr',
    transactionId: ''
  });

  const [step, setStep] = useState(1);

  if (!event) return <div className="p-20 text-center">Event not found</div>;

  const totalAmount = event.price * formData.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.userPhone || !formData.transactionId) {
      toast.error(t.buyTicket.error);
      return;
    }

    buyTicket({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.locationName,
      userName: formData.userName,
      userPhone: formData.userPhone,
      userEmail: formData.userEmail,
      quantity: formData.quantity,
      totalAmount,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.transactionId
    });

    setStep(3);
    toast.success(t.buyTicket.success);
  };

  const paymentMethods = [
    { id: 'Telebirr', name: 'Telebirr', icon: Smartphone, color: 'text-indigo-600', bg: 'bg-indigo-50', account: '0912345678' },
    { id: 'CBE Birr', name: 'CBE Birr', icon: Landmark, color: 'text-purple-600', bg: 'bg-purple-50', account: '1000123456789' },
    { id: 'M-Pesa', name: 'M-Pesa', icon: Smartphone, color: 'text-red-600', bg: 'bg-red-50', account: '0987654321' }
  ];

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                  step === s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : 
                  step > s ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                )}>
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < 3 && <div className={cn("w-12 sm:w-20 h-1 mx-2 rounded", step > s ? "bg-green-500" : "bg-gray-200")} />}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-3xl font-black">{t.buyTicket.title}</CardTitle>
                    <CardDescription>Enter your details to proceed with the booking</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.buyTicket.fullName}</Label>
                        <Input 
                          id="name"
                          required
                          value={formData.userName}
                          onChange={e => setFormData({...formData, userName: e.target.value})}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.buyTicket.phone}</Label>
                        <Input 
                          id="phone"
                          required
                          value={formData.userPhone}
                          onChange={e => setFormData({...formData, userPhone: e.target.value})}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.buyTicket.email}</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.userEmail}
                        onChange={e => setFormData({...formData, userEmail: e.target.value})}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="space-y-4">
                       <Label>{t.buyTicket.quantity}</Label>
                       <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-fit">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})}
                            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold hover:bg-indigo-50 transition-colors"
                          > - </button>
                          <span className="text-xl font-black px-4">{formData.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, quantity: formData.quantity + 1})}
                            className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold hover:bg-indigo-50 transition-colors"
                          > + </button>
                       </div>
                    </div>

                    <Button 
                      onClick={() => setStep(2)}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-lg shadow-lg shadow-indigo-600/20 mt-4"
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-black">{t.buyTicket.paymentMethod}</CardTitle>
                      <CardDescription>Choose how you want to pay</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="rounded-full">
                       <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {paymentMethods.map((method) => (
                         <button
                          key={method.id}
                          onClick={() => setFormData({...formData, paymentMethod: method.id})}
                          className={cn(
                            "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                            formData.paymentMethod === method.id 
                              ? "border-indigo-600 bg-indigo-50/50 shadow-md" 
                              : "border-gray-100 hover:border-indigo-200"
                          )}
                         >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", method.bg)}>
                               <method.icon className={cn("w-6 h-6", method.color)} />
                            </div>
                            <span className="font-bold text-sm">{method.name}</span>
                         </button>
                       ))}
                    </div>

                    <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                       <div className="relative z-10">
                          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Payment Account</p>
                          <h4 className="text-2xl font-black mb-4">{selectedMethod?.account}</h4>
                          <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl border border-white/10">
                             <Info className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                             <p className="text-sm text-indigo-50 leading-relaxed">
                                Please transfer exactly <span className="font-black text-white">{totalAmount} ETB</span> to the account above via {formData.paymentMethod}. 
                                After payment, enter your Transaction ID below.
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <Label htmlFor="txId" className="text-lg font-bold">{t.buyTicket.transactionId}</Label>
                       <Input 
                        id="txId"
                        placeholder="Enter transaction ID here"
                        required
                        value={formData.transactionId}
                        onChange={e => setFormData({...formData, transactionId: e.target.value})}
                        className="h-14 rounded-2xl text-lg font-mono tracking-widest uppercase"
                       />
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/30 mt-4"
                    >
                      Confirm Payment & Booking
                      <CheckCircle2 className="ml-2 w-6 h-6" />
                    </Button>
                  </CardContent>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                   <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircle2 className="w-12 h-12" />
                   </div>
                   <h2 className="text-4xl font-black text-gray-900 mb-4">Success!</h2>
                   <p className="text-lg text-gray-500 mb-10 max-w-sm mx-auto">
                     Your booking for <span className="font-bold text-gray-900">{event.title}</span> has been received. 
                     We are verifying your payment.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-14 px-8 font-bold">
                        <Link to="/my-tickets">View My Tickets</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl h-14 px-8 font-bold">
                        <Link to="/events">Browse More Events</Link>
                      </Button>
                   </div>
                </motion.div>
              )}
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                 <div className="aspect-video w-full overflow-hidden">
                    <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                 </div>
                 <CardContent className="p-6">
                    <h3 className="font-black text-xl mb-4">{event.title}</h3>
                    <div className="space-y-3">
                       <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                          {event.date}
                       </div>
                       <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                          {event.locationName}
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-3xl bg-indigo-50 border border-indigo-100">
                 <CardContent className="p-6">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500">Price</span>
                          <span className="font-bold">{event.price} ETB</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500">Quantity</span>
                          <span className="font-bold">x {formData.quantity}</span>
                       </div>
                       <div className="h-px bg-indigo-200 my-2" />
                       <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-black text-2xl text-indigo-600">{totalAmount} ETB</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};