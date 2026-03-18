import React, { useRef } from 'react';
import { useAppContext, Ticket, Event } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, downloadTicketAsPdf, downloadImage, cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { Download, FileText, Clock, CheckCircle2, XCircle, Search, Ticket as TicketIcon, MapPin, Calendar, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const MyTickets: React.FC = () => {
  const { tickets = [], events = [] } = useAppContext();
  const { t } = useLanguage();

  const getEvent = (eventId: string) => (events || []).find(e => e?.id === eventId);

  const validTickets = (tickets || []).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900">{t?.tickets?.title || "My Tickets"}</h1>
            <p className="text-gray-600 mt-2">Manage and download your event tickets here.</p>
          </div>
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold flex items-center">
              <TicketIcon className="w-4 h-4 mr-2" />
              Total: {validTickets.length}
            </div>
          </div>
        </div>

        {validTickets.length === 0 ? (
          <Card className="border-none shadow-xl py-20 text-center">
            <CardContent>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 text-gray-400 rounded-full mb-6">
                <TicketIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t?.tickets?.noTickets || "No tickets yet"}</h3>
              <p className="text-gray-500 mt-2 mb-8">Browse our upcoming events and get your first ticket.</p>
              <Button asChild className="bg-indigo-600 rounded-xl px-8 h-12">
                <a href="/events">Explore Events</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {validTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} event={getEvent(ticket.eventId)} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TicketItem: React.FC<{ ticket: Ticket; event: Event | undefined; t: any }> = ({ ticket, event, t }) => {
  const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    pending: { label: t?.tickets?.pending || "Pending", icon: <Clock className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
    approved: { label: t?.tickets?.approved || "Approved", icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-green-100 text-green-700" },
    rejected: { label: t?.tickets?.rejected || "Rejected", icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-700" },
    used: { label: t?.tickets?.used || "Used", icon: <Search className="w-4 h-4" />, color: "bg-gray-100 text-gray-700" }
  };

  const statusKey = String(ticket?.status || '').toLowerCase();
  const currentStatus = statusConfig[statusKey] || {
    label: String(ticket?.status || "Unknown"),
    icon: <Info className="w-4 h-4" />,
    color: "bg-gray-100 text-gray-700"
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById(`qr-${ticket.id}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      downloadImage(url, `ticket-qr-${ticket.id}.png`);
    }
  };

  const handleDownloadPdf = async () => {
    await downloadTicketAsPdf(`ticket-content-${ticket.id}`, `harmony-ticket-${ticket.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
    >
      <div className="flex flex-col md:flex-row">
        {/* Ticket Header/Info */}
        <div className="flex-[3] p-8 border-r border-dashed border-gray-200 relative">
          {/* Perforation holes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full"></div>
          <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gray-50 rounded-full"></div>
          
          <div className="flex items-center justify-between mb-6">
            <Badge className={cn("px-4 py-1.5 rounded-full border-none flex items-center gap-2", currentStatus?.color || "bg-gray-100 text-gray-700")}>
              {currentStatus?.icon}
              {currentStatus?.label}
            </Badge>
            <span className="text-xs font-mono text-gray-400"># {ticket.id}</span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-6">{event?.title || "Event Information Unavailable"}</h2>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Attendee</p>
              <p className="font-bold text-gray-800">{ticket.userName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Quantity</p>
              <p className="font-bold text-gray-800">{ticket.quantity} Person(s)</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date & Time</p>
              <div className="flex items-center font-bold text-gray-800">
                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                {event?.date ? formatDate(event.date) : "TBD"}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Venue</p>
              <div className="flex items-center font-bold text-gray-800">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                {event?.locationName || event?.location || "TBD"}
              </div>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className="flex-1 bg-indigo-50 p-8 flex flex-col items-center justify-center">
          {ticket.status === 'approved' || ticket.status === 'used' ? (
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6">
              <QRCodeSVG 
                id={`qr-${ticket.id}`}
                value={ticket.id} 
                size={140}
                level="H"
                includeMargin={true}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 border-4 border-white/50 border-dashed">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
          )}

          {ticket.status === 'approved' && (
            <div className="flex flex-col w-full gap-2">
              <Button size="sm" onClick={handleDownloadQr} className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs text-white">
                <Download className="w-3 h-3 mr-1" /> QR Image
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadPdf} className="w-full bg-white text-xs border-indigo-200">
                <FileText className="w-3 h-3 mr-1" /> PDF Ticket
              </Button>
            </div>
          )}
          
          {ticket.status === 'pending' && (
            <p className="text-[10px] text-indigo-600/70 text-center font-medium">
              Awaiting admin approval.<br/>QR will appear here.
            </p>
          )}

          {ticket.status === 'rejected' && (
            <p className="text-[10px] text-red-500 text-center font-medium">
              Payment verification failed.
            </p>
          )}
        </div>
      </div>

      {/* Hidden printable ticket for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div id={`ticket-content-${ticket.id}`} className="w-[600px] bg-white p-12 text-black">
          <div className="border-4 border-indigo-600 p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-black text-indigo-600 mb-2">HARMONY</h1>
                <p className="text-gray-500 font-bold tracking-widest text-xs">EVENT & PROMOTION</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase font-bold">Ticket ID</p>
                <p className="font-mono font-bold text-xl">{ticket.id}</p>
              </div>
            </div>

            <div className="mb-10">
              <p className="text-gray-400 text-xs uppercase font-bold mb-1">Event</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">{event?.title || "Event Information Unavailable"}</h2>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Attendee Name</p>
                <p className="text-xl font-bold">{ticket.userName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Quantity</p>
                <p className="text-xl font-bold">{ticket.quantity} Person(s)</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Date & Time</p>
                <p className="text-xl font-bold">{event?.date ? formatDate(event.date) : "TBD"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Location</p>
                <p className="text-xl font-bold">{event?.locationName || event?.location || "TBD"}</p>
              </div>
            </div>

            <div className="flex justify-center items-center py-10 border-t-2 border-dashed border-gray-100">
              <div className="bg-white p-6 border-2 border-indigo-50 rounded-3xl shadow-sm">
                <QRCodeSVG value={ticket.id} size={200} level="H" />
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs italic">
              Please present this digital or printed ticket at the entrance. Each ticket is valid for one-time entry only.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyTickets;