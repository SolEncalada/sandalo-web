import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BotonSalir from "@/app/aula/BotonSalir";

export default async function ClasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Si la clase no está liberada para la alumna, la base de datos no la devuelve.
  const { data } = await supabase
    .from("clases")
    .select("id, titulo, orden, vimeo_id, cursos(titulo)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const clase = data as unknown as {
    id: string;
    titulo: string;
    orden: number;
    vimeo_id: string | null;
    cursos: { titulo: string } | null;
  };

  const videoValido = clase.vimeo_id && /^\d+$/.test(clase.vimeo_id);

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

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/aula" className="text-sm text-[#0b589c] hover:underline">
          ← Volver a mis clases
        </Link>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          {clase.cursos?.titulo} · Clase {clase.orden}
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          {clase.titulo}
        </h1>

        {videoValido ? (
          <div className="mt-8 aspect-video w-full overflow-hidden rounded bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${clase.vimeo_id}?title=0&byline=0&portrait=0`}
              className="h-full w-full"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              title={clase.titulo}
            />
          </div>
        ) : (
          <p className="mt-8 rounded bg-white px-4 py-6 text-gray-700">
            El video de esta clase estará disponible pronto.
          </p>
        )}
      </section>
    </main>
  );
}
