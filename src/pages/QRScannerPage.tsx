import React, { useState } from 'react';
import { useAppContext, Ticket } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, CheckCircle2, XCircle, Clock, Search, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const QRScannerPage: React.FC = () => {
  const { tickets, updateTicketStatus, isAdmin } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<{ 
    success: boolean; 
    ticket?: Ticket; 
    error?: string 
  } | null>(null);
  const [inputCode, setInputCode] = useState('');

  if (!isAdmin) {
    navigate('/admin-login');
    return null;
  }

  const handleScan = (code: string) => {
    const cleanCode = (code || '').toUpperCase();
    if (!cleanCode) return;
    
    const ticket = (tickets || []).find(t => t?.id === cleanCode);

    if (!ticket) {
      setScanResult({
        success: false,
        error: 'TICKET NOT FOUND'
      });
      toast.error('Invalid ticket code');
      return;
    }

    if (ticket.status === 'used') {
      setScanResult({
        success: false,
        ticket,
        error: 'TICKET ALREADY USED'
      });
      toast.warning('Ticket has already been used');
    } else if (ticket.status !== 'approved') {
      setScanResult({
        success: false,
        ticket,
        error: `TICKET STATUS: ${String(ticket.status || '').toUpperCase()}`
      });
      toast.error('Ticket not approved yet');
    } else {
      setScanResult({
        success: true,
        ticket
      });
      toast.success('Valid ticket detected!');
    }
  };

  const confirmEntry = () => {
    if (scanResult?.ticket) {
      updateTicketStatus(scanResult.ticket.id, 'used');
      setScanResult(null);
      setInputCode('');
      toast.success('Entry confirmed successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')} 
          className="mb-8 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20">
            <QrCode className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Staff Entry Scanner</h1>
          <p className="text-gray-500 font-medium">Scan ticket QR codes or enter ID manually to verify entry.</p>
        </div>

        <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden mb-8">
          <CardContent className="p-10">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                <input
                  autoFocus
                  type="text"
                  className="w-full h-16 bg-gray-50 border-none rounded-2xl px-14 text-xl font-mono font-bold tracking-widest focus:ring-4 focus:ring-indigo-600/10 transition-all"
                  placeholder="ENTER TICKET ID"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (e.target.value.length >= 7) handleScan(e.target.value);
                  }}
                />
              </div>
              <Button 
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg"
                onClick={() => handleScan(inputCode)}
              >
                Verify Ticket ID
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className={cn(
                "rounded-[40px] border-none shadow-2xl overflow-hidden",
                scanResult.success ? "bg-green-50" : "bg-red-50"
              )}>
                <CardContent className="p-10 text-center">
                  {scanResult.success ? (
                    <>
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-green-600 w-12 h-12" />
                      </div>
                      <h2 className="text-3xl font-black text-green-900 mb-2">ACCESS GRANTED</h2>
                      <p className="text-green-700 font-bold mb-8">Valid ticket verified for entry.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="text-red-600 w-12 h-12" />
                      </div>
                      <h2 className="text-3xl font-black text-red-900 mb-2">ACCESS DENIED</h2>
                      <p className="text-red-700 font-bold mb-8">{scanResult.error}</p>
                    </>
                  )}

                  {scanResult.ticket && (
                    <div className="bg-white rounded-[32px] p-8 text-left space-y-4 mb-8">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attendee</span>
                        <span className="font-bold text-gray-900">{scanResult.ticket.userName}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event</span>
                        <span className="font-bold text-gray-900">{scanResult.ticket.eventTitle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-black uppercase",
                          scanResult.ticket.status === 'approved' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        )}>
                          {scanResult.ticket.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {scanResult.success && (
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-16 rounded-2xl border-green-200 bg-white hover:bg-green-50 font-bold text-green-700"
                        onClick={() => setScanResult(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 h-16 rounded-2xl bg-green-600 hover:bg-green-700 font-black text-lg shadow-lg shadow-green-600/20"
                        onClick={confirmEntry}
                      >
                        Confirm Entry
                      </Button>
                    </div>
                  )}
                  
                  {!scanResult.success && (
                    <Button 
                      className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-lg shadow-lg shadow-red-600/20"
                      onClick={() => {setScanResult(null); setInputCode('');}}
                    >
                      <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 p-8 bg-indigo-50 rounded-[32px] flex items-start gap-4">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="text-white w-5 h-5" />
           </div>
           <div>
              <h4 className="font-bold text-indigo-900 mb-1">Security Check Active</h4>
              <p className="text-sm text-indigo-700/70 font-medium">
                Scanning mode is restricted to staff members. All entries are logged for security and auditing purposes.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default QRScannerPage;