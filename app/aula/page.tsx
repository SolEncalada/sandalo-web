import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BotonSalir from "./BotonSalir";

type Clase = { id: string; titulo: string; orden: number };
type Curso = { id: string; titulo: string; clases: Clase[] };
type Inscripcion = {
  vence_excepcion: string | null;
  grupos: { nombre: string; fecha_inicio: string; meses_acceso: number } | null;
};

function fechaVencimiento(i: Inscripcion): Date | null {
  if (i.vence_excepcion) return new Date(i.vence_excepcion + "T12:00:00");
  if (!i.grupos) return null;
  const f = new Date(i.grupos.fecha_inicio + "T12:00:00");
  f.setMonth(f.getMonth() + i.grupos.meses_acceso);
  return f;
}

function formatoFecha(d: Date) {
  return d.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Aula() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: alumna } = await supabase
    .from("alumnas")
    .select("nombre")
    .eq("user_id", user.id)
    .maybeSingle();

  let cursos: Curso[] = [];
  let inscripciones: Inscripcion[] = [];

  if (alumna) {
    const { data: dataCursos } = await supabase
      .from("cursos")
      .select("id, titulo, clases(id, titulo, orden)")
      .order("titulo")
      .order("orden", { referencedTable: "clases" });
    cursos = (dataCursos ?? []) as unknown as Curso[];

    const { data: dataIns } = await supabase
      .from("inscripciones")
      .select("vence_excepcion, grupos(nombre, fecha_inicio, meses_acceso)")
      .eq("aprobada", true);
    inscripciones = (dataIns ?? []) as unknown as Inscripcion[];
  }

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <header className="bg-[#0b589c] py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sandalo.svg"
            alt="Sándalo Center"
            className="h-10 w-auto brightness-0 invert opacity-95"
          />
          <BotonSalir />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-14">
        {alumna ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
              Aula virtual
            </p>
            <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
              Hola, {alumna.nombre}
            </h1>

            {inscripciones.map((i, idx) => {
              const vence = fechaVencimiento(i);
              if (!i.grupos || !vence) return null;
              return (
                <p key={idx} className="mt-3 text-sm text-gray-600">
                  {i.grupos.nombre} · tu acceso vence el {formatoFecha(vence)}
                </p>
              );
            })}

            {cursos.length === 0 ? (
              <p className="mt-10 text-gray-700">
                No tienes clases disponibles por ahora. Si crees que es un
                error, escríbenos por WhatsApp.
              </p>
            ) : (
              cursos.map((curso) => (
                <div key={curso.id} className="mt-10">
                  <h2 className="font-serif text-2xl text-[#0b589c]">
                    {curso.titulo}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {curso.clases.map((clase) => (
                      <li key={clase.id}>
                        <Link
                          href={`/aula/clase/${clase.id}`}
                          className="flex items-center gap-4 rounded bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b589c] text-sm text-white">
                            {clase.orden}
                          </span>
                          <span className="text-gray-800">{clase.titulo}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl italic text-[#0b589c]">
              Tu cuenta aún no está activada
            </h1>
            <p className="mt-4 text-gray-700">
              Tu correo todavía no está registrado en el aula. Escríbenos por
              WhatsApp para que el equipo de Sándalo Center lo habilite.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
