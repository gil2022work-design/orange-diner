import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, History, PlusCircle, CheckCircle2, AlertCircle, Upload, ChevronRight } from 'lucide-react';
import { supabase, type Transaccion, type Profile } from '@/src/lib/supabase';
import { formatCurrency, cn } from '@/src/lib/utils';

interface WalletProps {
  profile: Profile | null;
  onBack: () => void;
}

export function Wallet({ profile, onBack }: WalletProps) {
  const [transactions, setTransactions] = useState<Transaccion[]>([]);
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [reference, setReference] = useState('');
  const [currentTasa, setCurrentTasa] = useState<number | null>(null);

  useEffect(() => {
    if (profile) fetchTransactions();
    fetchTasa();
  }, [profile]);

  async function fetchTasa() {
    const { data } = await supabase
      .from('tasas_diarias')
      .select('valor')
      .eq('moneda', 'EUR')
      .order('fecha', { ascending: false })
      .limit(1);
    
    if (data && data[0]) setCurrentTasa(data[0].valor);
    else {
      // Fallback for demo if DB is empty
      setCurrentTasa(45.67);
    }
  }

  async function handleRecharge(e: React.FormEvent) {
    e.preventDefault();
    const montoUsd = parseFloat(rechargeAmount);
    const montoBs = currentTasa ? montoUsd * currentTasa : null;

    const { error } = await supabase.from('transacciones').insert({
      user_id: profile?.id,
      monto: montoUsd,
      monto_bs: montoBs,
      tasa_euro: currentTasa,
      tipo: 'recarga',
      referencia_bancaria: reference,
      estado: 'pendiente'
    });

    if (error) alert(error.message);
    else {
      alert('Recarga registrada. Pendiente de aprobación.');
      setIsRecharging(false);
      fetchTransactions();
    }
  }

  const calculatedBs = currentTasa && rechargeAmount 
    ? (parseFloat(rechargeAmount) * currentTasa).toLocaleString('es-VE', { minimumFractionDigits: 2 }) 
    : '0,00';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="glass-button py-2 px-4 flex items-center space-x-2 text-xs"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Volver a Inicio</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Wallet Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 border-brand-gold/20">
            <div className="flex items-center justify-between mb-8">
              <CreditCard className="w-8 h-8 text-brand-gold" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Virtual Wallet</span>
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Saldo Disponible</p>
            <h2 className="text-5xl font-display italic text-brand-gold mb-8">
              {formatCurrency(profile?.saldo_monedero || 0)}
            </h2>
            <button 
              onClick={() => setIsRecharging(true)}
              className="w-full bg-brand-gold text-brand-navy font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-brand-gold/90 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Recargar Fondos</span>
            </button>
          </div>

          {isRecharging && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card"
            >
              <h3 className="text-lg font-display italic text-brand-white mb-4">Nueva Recarga</h3>
              <div className="mb-6 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Tasa BCV (EUR)</span>
                  <span className="text-sm font-mono text-brand-white">{currentTasa?.toFixed(2)} Bs.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Total en Bolívares</span>
                  <span className="text-lg font-display text-brand-gold">{calculatedBs} Bs.</span>
                </div>
              </div>

              <form onSubmit={handleRecharge} className="space-y-4">
                <input 
                  type="number" 
                  placeholder="Monto a recargar (USD)"
                  required
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-gold text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Referencia Bancaria"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-gold text-sm"
                />
                <div className="p-8 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:border-brand-gold/30 transition-all cursor-pointer">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Subir Comprobante</span>
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-sm font-bold transition-all">
                    Enviar Reporte
                  </button>
                  <button type="button" onClick={() => setIsRecharging(false)} className="px-4 py-3 text-white/40 hover:text-white transition-all text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3">
        <div className="flex items-center space-x-3 mb-6">
          <History className="w-5 h-5 text-brand-gold" />
          <h3 className="text-xl font-display italic text-brand-white">Historial de Transacciones</h3>
        </div>

        <div className="space-y-3">
          {transactions.length > 0 ? transactions.map((tx) => (
            <div key={tx.id} className="premium-card p-4 flex items-center justify-between group overflow-hidden">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  tx.tipo === 'recarga' ? "bg-green-500/10 text-green-500" : 
                  tx.tipo === 'reembolso' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                )}>
                  {tx.tipo === 'recarga' ? <PlusCircle className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize">{tx.tipo.replace('_', ' ')}</p>
                  <div className="flex flex-col">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      {new Date(tx.created_at).toLocaleDateString()} • Ref: {tx.referencia_bancaria || '---'}
                    </p>
                    {tx.monto_bs && (
                      <p className="text-[9px] text-brand-gold/60 uppercase font-mono mt-0.5">
                        Pagado: {tx.monto_bs.toLocaleString('es-VE')} Bs. (Tasa: {tx.tasa_euro})
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "text-lg font-display",
                  tx.monto > 0 ? "text-green-500" : "text-brand-white"
                )}>
                  {tx.monto > 0 ? '+' : ''}{formatCurrency(tx.monto)}
                </p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  {tx.estado === 'aprobada' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] uppercase text-green-500 font-bold opacity-60">Aprobada</span>
                    </>
                  ) : tx.estado === 'pendiente' ? (
                    <>
                      <Clock className="w-3 h-3 text-brand-gold" />
                      <span className="text-[10px] uppercase text-brand-gold font-bold opacity-60">Pendiente</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] uppercase text-red-500 font-bold opacity-60">Rechazada</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="premium-card p-12 text-center border-dashed">
              <p className="text-white/20 text-sm">No hay transacciones registradas todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
