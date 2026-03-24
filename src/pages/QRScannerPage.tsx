import React, { useState, useEffect } from 'react';
import { useAppContext, Ticket } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, CheckCircle2, XCircle, Search, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const QRScannerPage: React.FC = () => {
  const { tickets, updateTicketStatus, isAdmin } = useAppContext();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [scanResult, setScanResult] = useState<{
    success: boolean;
    ticket?: Ticket;
    error?: string;
  } | null>(null);

  const [inputCode, setInputCode] = useState('');

  // ✅ FIX: Safe redirect using useEffect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // ✅ Prevent blank screen
  if (!isAdmin) {
    return <div className="p-10 text-center">Checking access...</div>;
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
        error: `TICKET STATUS: ${String(ticket.status).toUpperCase()}`
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

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')} 
          className="mb-8 text-gray-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <QrCode className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Staff Entry Scanner
          </h1>
          <p className="text-gray-500">
            Enter ticket ID manually to verify entry.
          </p>
        </div>

        {/* Input */}
        <Card className="rounded-3xl shadow-xl mb-8">
          <CardContent className="p-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
              <input
                type="text"
                className="w-full h-16 bg-gray-50 rounded-2xl px-14 text-xl font-mono font-bold"
                placeholder="ENTER TICKET ID"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (e.target.value.length >= 7) {
                    handleScan(e.target.value);
                  }
                }}
              />
            </div>

            <Button 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              onClick={() => handleScan(inputCode)}
            >
              Verify Ticket ID
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <AnimatePresence>
          {scanResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className={cn(
                "rounded-3xl shadow-xl",
                scanResult.success ? "bg-green-50" : "bg-red-50"
              )}>
                <CardContent className="p-8 text-center">

                  {scanResult.success ? (
                    <>
                      <CheckCircle2 className="text-green-600 w-12 h-12 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-green-800">ACCESS GRANTED</h2>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600 w-12 h-12 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-red-800">ACCESS DENIED</h2>
                      <p>{scanResult.error}</p>
                    </>
                  )}

                  {scanResult.success && (
                    <Button 
                      className="mt-6 bg-green-600 hover:bg-green-700 text-white"
                      onClick={confirmEntry}
                    >
                      Confirm Entry
                    </Button>
                  )}

                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="mt-12 p-6 bg-indigo-50 rounded-2xl flex gap-4">
          <ShieldCheck className="text-indigo-600" />
          <p className="text-sm text-indigo-700">
            Only admins can access this scanner.
          </p>
        </div>

      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default QRScannerPage;