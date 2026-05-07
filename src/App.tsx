import React, { useState, useEffect } from 'react';
import { supabase, type Profile } from '@/src/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Wallet as WalletView } from './components/Wallet';
import { Club } from './components/Club';
import { Messages } from './components/Messages';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) setProfile(data);
    } catch (e) {
      console.error("Error fetching profile", e);
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-brand-navy">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-brand-gold text-2xl font-display italic"
        >
          AceReserve
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!session ? (
        <Auth key="auth" />
      ) : (
        <Layout 
          key="app" 
          profile={profile} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard profile={profile} />}
              {activeTab === 'wallet' && <WalletView profile={profile} onBack={() => setActiveTab('dashboard')} />}
              {activeTab === 'community' && <Club onBack={() => setActiveTab('dashboard')} />}
              {activeTab === 'messages' && <Messages onBack={() => setActiveTab('dashboard')} />}
              {activeTab === 'calendar' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="glass-button py-2 px-4 flex items-center space-x-2 text-xs"
                    >
                      <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span>Volver a Inicio</span>
                    </button>
                    <div>
                      <h2 className="text-3xl font-display italic text-brand-white">Calendario de Reservas</h2>
                      <p className="text-white/40 text-sm">Gestiona tus tiempos y visualiza la disponibilidad mensual</p>
                    </div>
                  </div>
                  <div className="h-96 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10 rounded-3xl p-12 text-center bg-white/5">
                    <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="uppercase tracking-[0.2em] text-xs font-bold mb-2">Visión Mensual Progresiva</p>
                    <p className="max-w-xs text-sm italic">Estamos optimizando la vista de calendario para dispositivos móviles. Por ahora, usa el Dashboard para ver la disponibilidad inmediata.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Layout>
      )}
    </AnimatePresence>
  );
}
