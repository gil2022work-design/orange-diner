
// This code should be deployed as a Supabase Edge Function
// It simulates or calls an API to get the current BCV rate for EUR

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    // In production, you would fetch from BCV website or a trusted API
    // Example: const response = await fetch('https://api.ve/bcv/rates');
    // For this 2026 demo, we'll assume a realistic daily variation
    
    const baseRate = 45.50; // Example base rate for EUR in 2026
    const randomVariation = (Math.random() - 0.5) * 0.2;
    const currentRate = parseFloat((baseRate + randomVariation).toFixed(4));

    const { data, error } = await supabase
      .from('tasas_diarias')
      .upsert({ 
        moneda: 'EUR', 
        valor: currentRate,
        fecha: new Date().toISOString().split('T')[0]
      }, { onConflict: 'fecha' })
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, rate: currentRate }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
