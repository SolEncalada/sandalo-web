"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirAdmin } from "@/app/admin/guard";

function volver(tipo: "ok" | "error", mensaje: string): never {
  revalidatePath("/admin/grupos");
  redirect(`/admin/grupos?${tipo}=${encodeURIComponent(mensaje)}`);
}

function entero(valor: FormDataEntryValue | null, pordefecto: number): number {
  const n = Number(String(valor ?? "").trim());
  return Number.isFinite(n) && String(valor ?? "").trim() !== ""
    ? Math.max(0, Math.floor(n))
    : pordefecto;
}

export async function crearGrupo(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const cursoId = String(formData.get("curso_id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const meses = entero(formData.get("meses_acceso"), 6);
  const liberado = entero(formData.get("liberado_hasta"), 0);

  if (!cursoId || !nombre || !fechaInicio)
    volver("error", "Elige el curso, escribe el nombre y la fecha de inicio.");
  if (meses < 1) volver("error", "Los meses de acceso deben ser al menos 1.");

  const { error } = await supabase.from("grupos").insert({
    curso_id: cursoId,
    nombre,
    fecha_inicio: fechaInicio,
    meses_acceso: meses,
    liberado_hasta: liberado,
  });
  if (error) volver("error", `No se pudo crear el grupo: ${error.message}`);

  volver("ok", `Grupo creado: ${nombre}.`);
}

export async function guardarGrupo(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const meses = entero(formData.get("meses_acceso"), 6);
  const liberado = entero(formData.get("liberado_hasta"), 0);

  if (!id || !nombre || !fechaInicio)
    volver("error", "El nombre y la fecha de inicio no pueden quedar vacíos.");
  if (meses < 1) volver("error", "Los meses de acceso deben ser al menos 1.");

  const { error } = await supabase
    .from("grupos")
    .update({
      nombre,
      fecha_inicio: fechaInicio,
      meses_acceso: meses,
      liberado_hasta: liberado,
    })
    .eq("id", id);
  if (error) volver("error", `No se pudo guardar: ${error.message}`);

  volver("ok", "Grupo guardado.");
}
