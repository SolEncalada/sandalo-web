import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Deja pasar solo a administradoras; las demás vuelven al login o al aula.
export async function requerirAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: yo } = await supabase
    .from("alumnas")
    .select("nombre, es_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!yo || !yo.es_admin) redirect("/aula");

  return { supabase, nombre: yo.nombre as string };
}
