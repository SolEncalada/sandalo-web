"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirAdmin } from "@/app/admin/guard";
import { createAdminClient } from "@/lib/supabase/admin";

// Vuelve a la pantalla con un aviso verde (ok) o rojo (error).
function volver(tipo: "ok" | "error", mensaje: string): never {
  revalidatePath("/admin/alumnas");
  redirect(`/admin/alumnas?${tipo}=${encodeURIComponent(mensaje)}`);
}

// Crea la cuenta de acceso (ya confirmada, sin correo de verificación),
// la ficha de la alumna y, si se elige, la inscripción en un grupo.
export async function crearAlumna(formData: FormData) {
  const { supabase } = await requerirAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim().toLowerCase();
  const clave = String(formData.get("clave") ?? "");
  const grupoId = String(formData.get("grupo_id") ?? "");

  if (!nombre || !correo) volver("error", "Escribe el nombre y el correo.");
  if (clave.length < 8)
    volver("error", "La contraseña debe tener al menos 8 caracteres.");

  const admin = createAdminClient();

  const { data: creado, error: errCuenta } = await admin.auth.admin.createUser({
    email: correo,
    password: clave,
    email_confirm: true,
  });

  const userId = creado?.user?.id;
  if (errCuenta || !userId) {
    const yaExiste = /already|registered|exists/i.test(errCuenta?.message ?? "");
    volver(
      "error",
      yaExiste
        ? "Ya existe una cuenta con ese correo."
        : `No se pudo crear la cuenta: ${errCuenta?.message ?? "error desconocido"}`
    );
  }

  // Si el sistema ya creó o enlazó la ficha por el correo, la actualizamos;
  // si no existe, la creamos.
  const { data: existente } = await supabase
    .from("alumnas")
    .select("id")
    .ilike("correo", correo.replace(/[\\%_]/g, "\\$&"))
    .maybeSingle();

  let alumnaId: string | null = existente?.id ?? null;
  let errFicha: string | null = null;

  if (alumnaId) {
    const { error } = await supabase
      .from("alumnas")
      .update({ nombre, user_id: userId })
      .eq("id", alumnaId);
    if (error) errFicha = error.message;
  } else {
    const { data, error } = await supabase
      .from("alumnas")
      .insert({ nombre, correo, user_id: userId })
      .select("id")
      .single();
    if (error) errFicha = error.message;
    alumnaId = data?.id ?? null;
  }

  if (errFicha || !alumnaId) {
    // Para no dejar una cuenta suelta sin ficha, la borramos.
    await admin.auth.admin.deleteUser(userId);
    volver("error", `No se pudo guardar la ficha: ${errFicha ?? "error desconocido"}`);
  }

  if (grupoId) {
    const { error } = await supabase
      .from("inscripciones")
      .insert({ alumna_id: alumnaId, grupo_id: grupoId, aprobada: true });
    if (error) {
      volver(
        "error",
        `La alumna se creó, pero no se pudo inscribir en el grupo: ${error.message}`
      );
    }
  }

  volver("ok", `Alumna creada: ${nombre} (${correo}).`);
}

// Inscribe a una alumna existente en un grupo.
export async function inscribirEnGrupo(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const alumnaId = String(formData.get("alumna_id") ?? "");
  const grupoId = String(formData.get("grupo_id") ?? "");
  if (!alumnaId || !grupoId) volver("error", "Elige un grupo.");

  const { data: ya } = await supabase
    .from("inscripciones")
    .select("id")
    .eq("alumna_id", alumnaId)
    .eq("grupo_id", grupoId)
    .maybeSingle();
  if (ya) volver("error", "Esa alumna ya está inscrita en ese grupo.");

  const { error } = await supabase
    .from("inscripciones")
    .insert({ alumna_id: alumnaId, grupo_id: grupoId, aprobada: true });
  if (error) volver("error", `No se pudo inscribir: ${error.message}`);

  volver("ok", "Alumna inscrita en el grupo.");
}

// Cambia si el acceso está aprobado y la fecha de excepción de una inscripción.
export async function guardarInscripcion(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const aprobada = formData.get("aprobada") === "on";
  const vence = String(formData.get("vence_excepcion") ?? "").trim() || null;

  const { error } = await supabase
    .from("inscripciones")
    .update({ aprobada, vence_excepcion: vence })
    .eq("id", id);
  if (error) volver("error", `No se pudo guardar: ${error.message}`);

  volver("ok", "Cambios guardados.");
}

// Pone una contraseña nueva a la cuenta de una alumna.
export async function cambiarClave(formData: FormData) {
  await requerirAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const clave = String(formData.get("clave") ?? "");

  if (!userId)
    volver("error", "Esta alumna todavía no tiene cuenta de acceso.");
  if (clave.length < 8)
    volver("error", "La contraseña debe tener al menos 8 caracteres.");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: clave,
  });
  if (error) volver("error", `No se pudo cambiar la contraseña: ${error.message}`);

  volver("ok", "Contraseña cambiada.");
}
