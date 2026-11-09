import Link from "next/link";
import { requerirAdmin } from "@/app/admin/guard";
import AdminHeader from "@/app/admin/AdminHeader";

type Cliente = Awaited<ReturnType<typeof requerirAdmin>>["supabase"];

async function contar(supabase: Cliente, tabla: string) {
  const { count } = await supabase
    .from(tabla)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function Admin() {
  const { supabase, nombre } = await requerirAdmin();

  const [cursos, clases, grupos, alumnas, inscripciones] = await Promise.all([
    contar(supabase, "cursos"),
    contar(supabase, "clases"),
    contar(supabase, "grupos"),
    contar(supabase, "alumnas"),
    contar(supabase, "inscripciones"),
  ]);

  const tarjetas = [
    { titulo: "Cursos", n: cursos, href: "/admin/clases" },
    { titulo: "Clases", n: clases, href: "/admin/clases" },
    { titulo: "Grupos", n: grupos, href: null },
    { titulo: "Alumnas", n: alumnas, href: null },
    { titulo: "Inscripciones", n: inscripciones, href: null },
  ];

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <AdminHeader />

      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          Administración
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          Hola, {nombre}
        </h1>
        <p className="mt-3 text-gray-700">
          Resumen del aula. Entra a una sección para gestionarla.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tarjetas.map((t) => {
            const contenido = (
              <>
                <p className="font-serif text-4xl text-[#0b589c]">{t.n}</p>
                <p className="mt-1 text-sm text-gray-600">{t.titulo}</p>
                <p className="mt-3 text-xs text-[#0b589c]">
                  {t.href ? "Gestionar →" : "Próximamente"}
                </p>
              </>
            );
            return t.href ? (
              <Link
                key={t.titulo}
                href={t.href}
                className="rounded bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {contenido}
              </Link>
            ) : (
              <div key={t.titulo} className="rounded bg-white p-5 opacity-70 shadow-sm">
                {contenido}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
