import Link from "next/link";
import { requerirAdmin } from "@/app/admin/guard";
import AdminHeader from "@/app/admin/AdminHeader";
import {
  crearAlumna,
  inscribirEnGrupo,
  guardarInscripcion,
  cambiarClave,
} from "./actions";

type Inscripcion = {
  id: string;
  aprobada: boolean;
  vence_excepcion: string | null;
  grupo_id: string;
  grupos: { nombre: string; cursos: { titulo: string } | null } | null;
};
type Alumna = {
  id: string;
  user_id: string | null;
  nombre: string;
  correo: string;
  es_admin: boolean;
  inscripciones: Inscripcion[];
};
type Grupo = { id: string; nombre: string; cursos: { titulo: string } | null };

const campo =
  "rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0b589c]";
const botonAzul =
  "rounded bg-[#0b589c] px-4 py-2 text-sm text-white transition hover:bg-[#094a84]";
const botonBorde =
  "rounded border border-[#0b589c] px-4 py-2 text-sm text-[#0b589c] transition hover:bg-[#0b589c]/5";

export default async function AdminAlumnas({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; q?: string }>;
}) {
  const { supabase } = await requerirAdmin();
  const { ok, error, q } = await searchParams;

  // Quitamos signos que romperían la búsqueda.
  const buscar = (q ?? "").replace(/[,()%*]/g, " ").trim();

  let consulta = supabase
    .from("alumnas")
    .select(
      "id, user_id, nombre, correo, es_admin, inscripciones(id, aprobada, vence_excepcion, grupo_id, grupos(nombre, cursos(titulo)))"
    )
    .order("nombre");
  if (buscar) {
    consulta = consulta.or(`nombre.ilike.%${buscar}%,correo.ilike.%${buscar}%`);
  }

  const [{ data: dataAlumnas }, { data: dataGrupos }] = await Promise.all([
    consulta,
    supabase.from("grupos").select("id, nombre, cursos(titulo)").order("nombre"),
  ]);

  const alumnas = (dataAlumnas ?? []) as unknown as Alumna[];
  const grupos = (dataGrupos ?? []) as unknown as Grupo[];

  const etiquetaGrupo = (g: Grupo) =>
    g.cursos?.titulo ? `${g.cursos.titulo} — ${g.nombre}` : g.nombre;

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <AdminHeader />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          Administración
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          Alumnas
        </h1>
        <p className="mt-3 text-gray-700">
          Agrega una alumna con su correo y una contraseña que tú elijas, y
          elige su grupo. Después puedes aprobar o quitar su acceso, darle una
          fecha especial o cambiarle la contraseña.
        </p>

        {ok && (
          <p className="mt-6 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
            {ok}
          </p>
        )}
        {error && (
          <p className="mt-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <form
          action={crearAlumna}
          className="mt-8 rounded bg-white p-4 shadow-sm"
        >
          <h2 className="font-serif text-xl text-[#0b589c]">Nueva alumna</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700">Nombre</label>
              <input
                name="nombre"
                required
                placeholder="Nombre y apellido"
                className={`${campo} mt-1 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Correo</label>
              <input
                name="correo"
                type="email"
                required
                placeholder="correo@ejemplo.com"
                className={`${campo} mt-1 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                Contraseña (mínimo 8 caracteres)
              </label>
              <input
                name="clave"
                type="text"
                required
                minLength={8}
                autoComplete="off"
                placeholder="La que le vas a enviar"
                className={`${campo} mt-1 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Grupo</label>
              <select name="grupo_id" className={`${campo} mt-1 w-full`}>
                <option value="">Sin grupo por ahora</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {etiquetaGrupo(g)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className={`${botonAzul} mt-4`}>
            Crear alumna
          </button>
        </form>

        <form method="get" className="mt-10 flex flex-wrap items-center gap-3">
          <input
            name="q"
            defaultValue={buscar}
            placeholder="Buscar por nombre o correo"
            className={`${campo} w-72`}
          />
          <button type="submit" className={botonBorde}>
            Buscar
          </button>
          {buscar && (
            <Link href="/admin/alumnas" className="text-sm text-[#0b589c] underline">
              Ver todas
            </Link>
          )}
        </form>

        {alumnas.length === 0 && (
          <p className="mt-8 text-gray-700">
            {buscar
              ? "No hay alumnas que coincidan con la búsqueda."
              : "Todavía no hay alumnas."}
          </p>
        )}

        <ul className="mt-6 space-y-4">
          {alumnas.map((a) => (
            <li key={a.id} className="rounded bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="font-serif text-lg text-[#0b589c]">
                  {a.nombre}
                </h3>
                <span className="text-sm text-gray-600">{a.correo}</span>
                {a.es_admin && (
                  <span className="rounded bg-[#0b589c]/10 px-2 py-0.5 text-xs text-[#0b589c]">
                    Administradora
                  </span>
                )}
                {!a.user_id && (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    Sin cuenta de acceso
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {a.inscripciones.length === 0 && (
                  <p className="text-sm text-gray-600">
                    No está inscrita en ningún grupo.
                  </p>
                )}
                {a.inscripciones.map((i) => (
                  <form
                    key={i.id}
                    action={guardarInscripcion}
                    className="flex flex-wrap items-center gap-3 rounded border border-gray-200 p-2"
                  >
                    <input type="hidden" name="id" value={i.id} />
                    <span className="min-w-[12rem] flex-1 text-sm text-gray-800">
                      {i.grupos?.cursos?.titulo
                        ? `${i.grupos.cursos.titulo} — ${i.grupos.nombre}`
                        : (i.grupos?.nombre ?? "Grupo")}
                    </span>
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="aprobada"
                        defaultChecked={i.aprobada}
                      />
                      Acceso aprobado
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      Fecha especial
                      <input
                        type="date"
                        name="vence_excepcion"
                        defaultValue={i.vence_excepcion ?? ""}
                        className={campo}
                      />
                    </label>
                    <button type="submit" className={botonAzul}>
                      Guardar
                    </button>
                  </form>
                ))}
              </div>

              <form
                action={inscribirEnGrupo}
                className="mt-3 flex flex-wrap items-center gap-2"
              >
                <input type="hidden" name="alumna_id" value={a.id} />
                <select name="grupo_id" required className={`${campo} min-w-[14rem]`}>
                  <option value="">Inscribir en otro grupo…</option>
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {etiquetaGrupo(g)}
                    </option>
                  ))}
                </select>
                <button type="submit" className={botonBorde}>
                  Inscribir
                </button>
              </form>

              {a.user_id && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-[#0b589c]">
                    Cambiar contraseña
                  </summary>
                  <form
                    action={cambiarClave}
                    className="mt-2 flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="user_id" value={a.user_id} />
                    <input
                      name="clave"
                      type="text"
                      required
                      minLength={8}
                      autoComplete="off"
                      placeholder="Contraseña nueva"
                      className={`${campo} w-64`}
                    />
                    <button type="submit" className={botonAzul}>
                      Cambiar contraseña
                    </button>
                  </form>
                </details>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
