import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Ticket, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useAppContext } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { isAdmin } = useAppContext();
  const t = translations[language];

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/events", label: t.nav.events },
    { to: "/kids", label: t.nav.kids },
    { to: "/my-tickets", label: t.nav.myTickets },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Ticket className="w-6 h-6" />
          <span className="hidden sm:inline">Harmony Events</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <ShieldCheck className="w-4 h-4" />
              {t.nav.admin}
            </NavLink>
          )}

          <div className="flex items-center gap-2 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('am')}>አማርኛ (Amharic)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isAdmin && (
              <Button asChild size="sm" variant="ghost">
                <Link to="/admin">{t.nav.admin}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('am')}>አማርኛ (Amharic)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                <ShieldCheck className="w-5 h-5" />
                {t.nav.admin}
              </NavLink>
            )}
            {!isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-muted-foreground"
              >
                {t.nav.admin}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};