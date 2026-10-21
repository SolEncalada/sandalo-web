import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BotonSalir from "./BotonSalir";

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

      <section className="mx-auto max-w-3xl px-6 py-16">
        {alumna ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
              Aula virtual
            </p>
            <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
              Hola, {alumna.nombre}
            </h1>
            <p className="mt-4 text-gray-700">
              Aquí aparecerán tus clases.
            </p>
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
