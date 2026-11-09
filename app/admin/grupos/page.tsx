import { requerirAdmin } from "@/app/admin/guard";
import AdminHeader from "@/app/admin/AdminHeader";
import { crearGrupo, guardarGrupo } from "./actions";

type Curso = { id: string; titulo: string };
type Grupo = {
  id: string;
  nombre: string;
  fecha_inicio: string | null;
  meses_acceso: number;
  liberado_hasta: number;
  curso_id: string;
  cursos: { titulo: string } | null;
};

const campo =
  "rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0b589c]";
const botonAzul =
  "rounded bg-[#0b589c] px-4 py-2 text-sm text-white transition hover:bg-[#094a84]";

export default async function AdminGrupos({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { supabase } = await requerirAdmin();
  const { ok, error } = await searchParams;

  const [{ data: dataCursos }, { data: dataGrupos }] = await Promise.all([
    supabase.from("cursos").select("id, titulo").order("titulo"),
    supabase
      .from("grupos")
      .select(
        "id, nombre, fecha_inicio, meses_acceso, liberado_hasta, curso_id, cursos(titulo)"
      )
      .order("fecha_inicio", { ascending: false }),
  ]);

  const cursos = (dataCursos ?? []) as Curso[];
  const grupos = (dataGrupos ?? []) as unknown as Grupo[];

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <AdminHeader />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          Administración
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          Grupos
        </h1>
        <p className="mt-3 text-gray-700">
          Un grupo es una promoción de un curso: tiene una fecha de inicio, unos
          meses de acceso y un número de clases liberadas. Todas las alumnas del
          grupo ven las clases hasta el número que indiques. Para liberar más
          clases, sube ese número y guarda.
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
          action={crearGrupo}
          className="mt-8 rounded bg-white p-4 shadow-sm"
        >
          <h2 className="font-serif text-xl text-[#0b589c]">Nuevo grupo</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700">Curso</label>
              <select
                name="curso_id"
                required
                className={`${campo} mt-1 w-full`}
              >
                <option value="">Elige un curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                Nombre del grupo
              </label>
              <input
                name="nombre"
                required
                placeholder="Ej. Grupo Quito noviembre"
                className={`${campo} mt-1 w-full`}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                Fecha de inicio
              </label>
              <input
                name="fecha_inicio"
                type="date"
                required
                className={`${campo} mt-1 w-full`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700">
                  Meses de acceso
                </label>
                <input
                  name="meses_acceso"
                  type="number"
                  min={1}
                  defaultValue={6}
                  required
                  className={`${campo} mt-1 w-full`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Clases liberadas
                </label>
                <input
                  name="liberado_hasta"
                  type="number"
                  min={0}
                  defaultValue={0}
                  required
                  className={`${campo} mt-1 w-full`}
                />
              </div>
            </div>
          </div>
          <button type="submit" className={`${botonAzul} mt-4`}>
            Crear grupo
          </button>
        </form>

        {cursos.length === 0 && (
          <p className="mt-8 text-gray-700">
            Primero crea un curso en la pantalla de Clases.
          </p>
        )}
        {cursos.length > 0 && grupos.length === 0 && (
          <p className="mt-8 text-gray-700">Todavía no hay grupos.</p>
        )}

        <ul className="mt-8 space-y-4">
          {grupos.map((g) => (
            <li key={g.id} className="rounded bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                {g.cursos?.titulo ?? "Curso"}
              </p>
              <form
                action={guardarGrupo}
                className="mt-2 flex flex-wrap items-end gap-3"
              >
                <input type="hidden" name="id" value={g.id} />
                <div className="min-w-[12rem] flex-1">
                  <label className="block text-sm text-gray-700">Nombre</label>
                  <input
                    name="nombre"
                    defaultValue={g.nombre}
                    required
                    className={`${campo} mt-1 w-full`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Fecha de inicio
                  </label>
                  <input
                    name="fecha_inicio"
                    type="date"
                    defaultValue={g.fecha_inicio ?? ""}
                    required
                    className={`${campo} mt-1`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Meses de acceso
                  </label>
                  <input
                    name="meses_acceso"
                    type="number"
                    min={1}
                    defaultValue={g.meses_acceso}
                    required
                    className={`${campo} mt-1 w-28`}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Clases liberadas
                  </label>
                  <input
                    name="liberado_hasta"
                    type="number"
                    min={0}
                    defaultValue={g.liberado_hasta}
                    required
                    className={`${campo} mt-1 w-28`}
                  />
                </div>
                <button type="submit" className={botonAzul}>
                  Guardar
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
