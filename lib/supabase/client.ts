import { createBrowserClient } from "@supabase/ssr";

// Conexión a Supabase para usar en el navegador (páginas con "use client").
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
