import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BotonSalir from "./BotonSalir";
import EnlacePanel from "./EnlacePanel";

const WHATSAPP = "https://wa.me/593995191437";

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

const botonWhatsApp =
  "mt-5 inline-block rounded bg-[#0b589c] px-5 py-3 text-sm text-white transition hover:bg-[#094a84]";

export default async function Aula() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: alumna } = await supabase
    .from("alumnas")
    .select("id, nombre")
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
      .eq("alumna_id", alumna.id)
      .eq("aprobada", true);
    inscripciones = (dataIns ?? []) as unknown as Inscripcion[];
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const accesos = inscripciones.flatMap((i) => {
    const vence = fechaVencimiento(i);
    return i.grupos && vence ? [{ nombre: i.grupos.nombre, vence }] : [];
  });
  const hayVigente = accesos.some((a) => a.vence >= hoy);
  const ultimaVencida = accesos
    .filter((a) => a.vence < hoy)
    .sort((a, b) => b.vence.getTime() - a.vence.getTime())[0];

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
          <div className="flex items-center gap-4">
            <EnlacePanel />
            <BotonSalir />
          </div>
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

            {accesos.map((a, idx) => (
              <p key={idx} className="mt-3 text-sm text-gray-600">
                {a.nombre} ·{" "}
                {a.vence >= hoy ? "tu acceso vence el" : "tu acceso venció el"}{" "}
                {formatoFecha(a.vence)}
              </p>
            ))}

            {cursos.length === 0 ? (
              <div className="mt-10 rounded bg-white p-6 shadow-sm">
                {!hayVigente && ultimaVencida ? (
                  <>
                    <h2 className="font-serif text-2xl text-[#0b589c]">
                      Tu acceso venció
                    </h2>
                    <p className="mt-3 text-gray-700">
                      Tu acceso a {ultimaVencida.nombre} venció el{" "}
                      {formatoFecha(ultimaVencida.vence)}. Si quieres renovarlo
                      o tienes alguna duda, escríbenos y lo coordinamos.
                    </p>
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={botonWhatsApp}
                    >
                      Escribir por WhatsApp
                    </a>
                  </>
                ) : accesos.length === 0 ? (
                  <>
                    <h2 className="font-serif text-2xl text-[#0b589c]">
                      Aún no tienes un grupo asignado
                    </h2>
                    <p className="mt-3 text-gray-700">
                      Tu cuenta está activa, pero todavía no estás inscrita en
                      un grupo. Escríbenos y el equipo de Sándalo Center lo
                      resuelve.
                    </p>
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={botonWhatsApp}
                    >
                      Escribir por WhatsApp
                    </a>
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl text-[#0b589c]">
                      Todavía no hay clases liberadas
                    </h2>
                    <p className="mt-3 text-gray-700">
                      Tu grupo está inscrito, pero aún no se libera la primera
                      clase. Cuando esté disponible la verás aquí.
                    </p>
                  </>
                )}
              </div>
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
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={botonWhatsApp}
            >
              Escribir por WhatsApp
            </a>
          </>
        )}
      </section>
    </main>
  );
}
