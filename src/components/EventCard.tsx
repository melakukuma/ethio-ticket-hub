import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Map properties if they use different names in different parts of the app
  const poster = event.poster || event.image;
  const shortDescription = event.shortDescription || event.description;
  const location = event.locationName || event.location;

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow border-none bg-secondary/50">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={poster} 
          alt={event.title} 
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full font-bold text-sm">
          {formatCurrency(event.price)}
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow space-y-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {shortDescription}
        </p>
        <div className="space-y-1 text-sm text-foreground/80">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/event/${event.id}`}>{t.events.details}</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to={`/buy-ticket/${event.id}`}>{t.events.buyNow}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};