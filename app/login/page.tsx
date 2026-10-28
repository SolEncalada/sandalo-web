"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const supabase = createClient();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: clave,
    });

    if (errorLogin) {
      setError(
        errorLogin.message.toLowerCase().includes("not confirmed")
          ? "Tu correo aún no está confirmado."
          : "Correo o contraseña incorrectos."
      );
      setCargando(false);
      return;
    }

    router.push("/aula");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f4f0e7]">
      <header className="bg-[#0b589c] py-5">
        <div className="mx-auto flex max-w-5xl items-center px-6">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-sandalo.svg"
              alt="Sándalo Center"
              className="h-10 w-auto brightness-0 invert opacity-95"
            />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-md px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b589c]">
          Aula virtual
        </p>
        <h1 className="mt-2 font-serif text-3xl italic text-[#0b589c]">
          Ingresa a tus clases
        </h1>

        <form onSubmit={entrar} className="mt-8 space-y-5">
          <div>
            <label htmlFor="correo" className="block text-sm text-gray-700">
              Correo electrónico
            </label>
            <input
              id="correo"
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#0b589c]"
            />
          </div>

          <div>
            <label htmlFor="clave" className="block text-sm text-gray-700">
              Contraseña
            </label>
            <input
              id="clave"
              type="password"
              required
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 outline-none focus:border-[#0b589c]"
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded bg-[#0b589c] px-4 py-3 text-white transition hover:bg-[#094a84] disabled:opacity-60"
          >
            {cargando ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
