"use server";

import { revalidatePath } from "next/cache";
import { requerirAdmin } from "@/app/admin/guard";

// Acepta el número de Vimeo o el enlace completo y se queda con el número.
function extraerVimeo(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  if (!texto) return null;
  const m = texto.match(/\d{6,}/);
  if (!m) {
    throw new Error(
      "El número de Vimeo no es válido. Pega el número o el enlace del video."
    );
  }
  return m[0];
}

export async function crearCurso(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return;
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;

  const { error } = await supabase.from("cursos").insert({ titulo, descripcion });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clases");
}

export async function crearClase(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const cursoId = String(formData.get("curso_id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!cursoId || !titulo) return;
  const vimeoId = extraerVimeo(formData.get("vimeo_id"));

  const { data: ultima } = await supabase
    .from("clases")
    .select("orden")
    .eq("curso_id", cursoId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const orden = (ultima?.orden ?? 0) + 1;

  const { error } = await supabase.from("clases").insert({
    curso_id: cursoId,
    titulo,
    orden,
    vimeo_id: vimeoId,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clases");
}

export async function guardarClase(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!id || !titulo) return;
  const vimeoId = extraerVimeo(formData.get("vimeo_id"));
  const visible = formData.get("visible") === "on";

  const { error } = await supabase
    .from("clases")
    .update({ titulo, vimeo_id: vimeoId, visible })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clases");
}

export async function moverClase(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = Number(formData.get("dir") ?? 0);
  if (!id || !dir) return;

  const { error } = await supabase.rpc("mover_clase", {
    p_id: id,
    p_dir: dir,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/clases");
}
