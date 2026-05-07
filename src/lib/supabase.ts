import { createClient } from '@supabase/supabase-js'

// Estas variables leen lo que configuramos en Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de seguridad para evitar que la app rompa
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las llaves de configuración. Revisa las variables de entorno en Vercel.")
}

// Creamos el cliente con la configuración estándar de 2026
// Esta forma corrige automáticamente el error de "Invalid Path"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
