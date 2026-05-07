import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Mail, Search, Inbox, SendHorizontal, Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MessagesProps {
  onBack: () => void;
}

export function Messages({ onBack }: MessagesProps) {
  const [activeThread, setActiveThread] = useState(1);

  const threads = [
    {
      id: 1,
      title: "Administración - Recarga #4521",
      preview: "Tu recarga ha sido aprobada correctamente.",
      date: "10:45 AM",
      unread: true,
      category: "Administración"
    },
    {
      id: 2,
      title: "Coach Roberto Mansilla",
      preview: "¿Confirmamos la clase de las 18:00?",
      date: "Ayer",
      unread: false,
      category: "Entrenamiento"
    },
    {
      id: 3,
      title: "Bienvenida al Club",
      preview: "Bienvenido a AceReserve Premium. Aquí tienes...",
      date: "2 May",
      unread: false,
      category: "Sistema"
    }
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="glass-button py-2 px-4 flex items-center space-x-2 text-xs"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver a Inicio</span>
        </button>
      </div>

      <div className="h-[75vh] flex space-x-6">
      {/* Sidebar - Threads */}
      <div className="w-80 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Inbox className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-display italic text-brand-white">Buzón</h2>
          </div>
          <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {threads.map((thread) => (
            <motion.button
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              whileHover={{ x: 4 }}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group",
                activeThread === thread.id
                  ? "bg-white/10 border-brand-gold/30"
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              )}
            >
              {thread.unread && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,1)]" />
              )}
              <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-1 opacity-60">
                {thread.category}
              </p>
              <h4 className="text-sm font-semibold text-brand-white truncate mb-1">{thread.title}</h4>
              <p className="text-xs text-white/40 truncate">{thread.preview}</p>
              <p className="text-[10px] text-white/20 mt-2 font-mono text-right">{thread.date}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-display italic text-lg text-brand-white">Administración</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">En línea ahora</p>
                </div>
              </div>
            </div>
            <button className="text-xs text-white/40 hover:text-white uppercase tracking-widest font-bold">Ver Detalles</button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto relative z-10">
          <div className="flex justify-center">
            <span className="text-[10px] px-3 py-1 bg-white/5 rounded-full text-white/20 uppercase font-bold tracking-widest">Hoy</span>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[70%] bg-brand-gold text-brand-navy p-4 rounded-2xl rounded-tr-none text-sm font-medium">
              Hola, acabo de subir el comprobante de mi transferencia. ¿Podrían revisarlo?
              <p className="text-[10px] text-brand-navy/60 mt-1 font-mono text-right">10:41 AM</p>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white/10 text-brand-white p-4 rounded-2xl rounded-tl-none text-sm">
              Hola. Recibido perfectamente. Tu saldo ya ha sido actualizado y puedes proceder con tu reserva. ¡Que tengas un buen juego!
              <p className="text-[10px] text-white/40 mt-1 font-mono text-right text-right">10:45 AM</p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-white/10 relative z-10">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Escribe tu mensaje aquí..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-brand-gold text-sm text-brand-white"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-navy p-2.5 rounded-xl hover:scale-105 transition-transform active:scale-95">
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
