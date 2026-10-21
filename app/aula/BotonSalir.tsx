"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function BotonSalir() {
  const router = useRouter();

  async function salir() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={salir}
      className="rounded border border-white/60 px-4 py-2 text-sm text-white transition hover:bg-white/10"
    >
      Salir
    </button>
  );
}
