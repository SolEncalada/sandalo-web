import { createClient } from "@supabase/supabase-js";

// Cliente con la llave secreta de Supabase (service_role).
// Solo se usa dentro de acciones del servidor protegidas por requerirAdmin().
// Nunca lo importes desde un componente de navegador ("use client").
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Falta la variable SUPABASE_SERVICE_ROLE_KEY en .env.local (o en Vercel)."
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
