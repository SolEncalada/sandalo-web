import { requerirAdmin } from "@/app/admin/guard";
import AdminHeader from "@/app/admin/AdminHeader";
import {
  crearCurso,
  crearClase,
  guardarClase,
  moverClase,
} from "./actions";

type Clase = {
  id: string;
  titulo: string;
  orden: number;
  vimeo_id: string | null;
  visible: boolean;
};
type Curso = { id: string; titulo: string; clases: Clase[] };

const campo =
  "rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#0b589c]";
const botonAzul =
  "rounded bg-[#0b589c] px-4 py-2 text-sm text-white transition hover:bg-[#094a84]";
const botonFlecha =
  "flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50";

export default async function AdminClases() {
  const { supabase } = await requerirAdmin();

  const { data } = await supabase
    .from("cursos")
    .select("id, titulo, clases(id, titulo, orden, vimeo_id, visible)")
    .order("titulo")
    .order("orden", { referencedTable: "clases" });

  const cursos = (data ?? []) as unknown as Curso[];

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <AdminHeader />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          Administración
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          Cursos y clases
        </h1>
        <p className="mt-3 text-gray-700">
          Crea cursos, agrega clases y pega el número de Vimeo de cada video.
          Puedes pegar el enlace completo de Vimeo y el sistema toma el número.
          Si desmarcas Visible, la clase deja de verse para las alumnas, sin
          borrarla.
        </p>

        <form
          action={crearCurso}
          className="mt-8 flex flex-wrap items-end gap-3 rounded bg-white p-4 shadow-sm"
        >
          <div className="min-w-[14rem] flex-1">
            <label className="block text-sm text-gray-700">Nuevo curso</label>
            <input
              name="titulo"
              required
              placeholder="Ej. Masaje corporal"
              className={`${campo} mt-1 w-full`}
            />
          </div>
          <button type="submit" className={botonAzul}>
            Crear curso
          </button>
        </form>

        {cursos.length === 0 && (
          <p className="mt-10 text-gray-700">Todavía no hay cursos.</p>
        )}

        {cursos.map((curso) => (
          <div key={curso.id} className="mt-12">
            <h2 className="font-serif text-2xl text-[#0b589c]">
              {curso.titulo}
            </h2>

            <ul className="mt-4 space-y-3">
              {curso.clases.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-2 rounded bg-white p-3 shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b589c] text-sm text-white">
                    {c.orden}
                  </span>

                  <form
                    action={guardarClase}
                    className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="id" value={c.id} />
                    <input
                      name="titulo"
                      defaultValue={c.titulo}
                      required
                      className={`${campo} min-w-[12rem] flex-1`}
                    />
                    <input
                      name="vimeo_id"
                      defaultValue={c.vimeo_id ?? ""}
                      placeholder="Número o enlace de Vimeo"
                      className={`${campo} w-56`}
                    />
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name="visible"
                        defaultChecked={c.visible}
                      />
                      Visible
                    </label>
                    <button type="submit" className={botonAzul}>
                      Guardar
                    </button>
                  </form>

                  <form action={moverClase}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="dir" value="-1" />
                    <button type="submit" title="Subir" className={botonFlecha}>
                      ↑
                    </button>
                  </form>
                  <form action={moverClase}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="dir" value="1" />
                    <button type="submit" title="Bajar" className={botonFlecha}>
                      ↓
                    </button>
                  </form>
                </li>
              ))}

              {curso.clases.length === 0 && (
                <li className="text-sm text-gray-600">
                  Este curso todavía no tiene clases.
                </li>
              )}
            </ul>

            <form
              action={crearClase}
              className="mt-4 flex flex-wrap items-end gap-3 rounded border border-dashed border-[#0b589c]/40 p-4"
            >
              <input type="hidden" name="curso_id" value={curso.id} />
              <div className="min-w-[12rem] flex-1">
                <label className="block text-sm text-gray-700">
                  Nueva clase
                </label>
                <input
                  name="titulo"
                  required
                  placeholder="Título de la clase"
                  className={`${campo} mt-1 w-full`}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Vimeo (opcional)
                </label>
                <input
                  name="vimeo_id"
                  placeholder="Número o enlace"
                  className={`${campo} mt-1 w-56`}
                />
              </div>
              <button type="submit" className={botonAzul}>
                Agregar clase
              </button>
            </form>
          </div>
        ))}
      </section>
    </main>
  );
}
