import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAppContext();
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      toast.success("Welcome back, Admin!");
      navigate('/admin');
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardHeader className="bg-indigo-600 text-white p-8 text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">{t.admin.login}</CardTitle>
          <CardDescription className="text-indigo-100 mt-2 font-medium">Secure access to Harmony dashboard</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t.admin.username}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  id="username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="h-12 pl-12 rounded-xl"
                  placeholder="Enter username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.admin.password}</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 pl-12 rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-600/20">
              {t.admin.submit}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Authorized personnel only. All access is logged and monitored for security purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};