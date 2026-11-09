import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Muestra "Volver al panel" solo si quien mira es administradora.
export default async function EnlacePanel() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("alumnas")
    .select("es_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data?.es_admin) return null;

  return (
    <Link href="/admin" className="text-sm text-white hover:underline">
      Volver al panel
    </Link>
  );
}
