import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { motion } from 'motion/react';
import { Mail, Lock, Loader2 } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-brand-navy">
      <div className="hidden lg:flex relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1595435063821-689396f4236e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        <div className="relative z-10 p-12 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-display italic text-brand-gold mb-4 leading-tight">
              Donde la pasión <br /> se encuentra con el lujo.
            </h1>
            <p className="text-white/60 max-w-sm font-sans tracking-wide">
              Accede al club más exclusivo de tenis y pádel. Reservas en tiempo real y gestión sin fricción.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-display text-4xl italic text-brand-gold mb-2">AceReserve</h2>
            <p className="text-white/40 uppercase tracking-widest text-xs">Premium Club Membership</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-gold/50 transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-gold/50 transition-all text-sm"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-gold text-brand-navy font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-brand-gold/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/40 text-sm hover:text-white transition-colors"
            >
              {isSignUp ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No eres socio? Solicita acceso'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
