import Link from "next/link";
import BotonSalir from "@/app/aula/BotonSalir";

export default function AdminHeader() {
  return (
    <header className="bg-[#0b589c] py-5">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
        <Link href="/admin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sandalo.svg"
            alt="Sándalo Center"
            className="h-10 w-auto brightness-0 invert opacity-95"
          />
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white">
          <Link href="/admin/clases" className="hover:underline">
            Clases
          </Link>
          <Link href="/aula" className="hover:underline">
            Ver aula
          </Link>
          <BotonSalir />
        </nav>
      </div>
    </header>
  );
}
