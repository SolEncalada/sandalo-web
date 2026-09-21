"use client";

import { useState } from "react";
import Link from "next/link";
import { courses } from "./cursos/data";

type Pillar = {
  num: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
  body: React.ReactNode;
};

const stats = [
  { value: "27", label: "años de experiencia" },
  { value: "+2.000", label: "profesionales formados" },
  { value: "14", label: "certificaciones internacionales" },
  { value: "12", label: "años con referentes mundiales" },
];

const formacionCursos = courses.filter((c) => c.pillarNum === "01");
const perfeccionamientoProgramas = courses.filter((c) => c.pillarNum === "02");

const consultoriaAreas = [
  "Diagnóstico y auditoría",
  "Conceptualización",
  "Carta de servicios",
  "Protocolización",
  "Experiencia del huésped",
  "Operaciones",
  "Talento humano",
  "Entrenamiento técnico",
  "Costos y rentabilidad",
  "Estándares de calidad",
  "Implementación y acompañamiento",
];

const consultoriaProyectos = [
  "Mashpi Lodge",
  "Metropolitan Touring",
  "ArtHotels – Hotel Mamá Cuchara",
  "Hotel Otavalo",
  "Samari Spa Resort",
  "La Mirage Garden Hotel & Spa",
];

const talentoCompetencias = [
  "Competencia técnica",
  "Actitud de servicio",
  "Cultura de hospitalidad",
  "Excelencia profesional",
];

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const pillars: Pillar[] = [
  {
    num: "01",
    title: "Formación y Perfeccionamiento",
    summary: "Bases sólidas, respaldo académico y entrenamiento avanzado para profesionales con experiencia.",
    icon: (
      <svg {...iconProps}>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
    body: (
      <div>
        <p className="text-stone-600 max-w-xl">
          Programas con Aval a la Excelencia Académica de World Spa
          Organization (WSO). Modalidad híbrida en Ecuador (teoría virtual +
          práctica presencial guiada) y modalidad online para profesionales
          en el extranjero.
        </p>
        <p className="mt-6 text-xs tracking-[0.15em] text-stone-400">
          FORMACIÓN PROFESIONAL
        </p>
        <ul className="mt-3 divide-y divide-stone-200 border-t border-stone-200 max-w-xl">
          {formacionCursos.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/cursos/${c.slug}`}
                className="flex justify-between gap-4 py-2.5 text-sm group"
              >
                <span className="text-slate-800 group-hover:underline underline-offset-4">
                  {c.title}
                </span>
                <span className="text-stone-400 shrink-0">{c.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs tracking-[0.15em] text-stone-400">
          PERFECCIONAMIENTO
        </p>
        <p className="mt-2 text-stone-600 max-w-xl text-sm">
          Dirigido a profesionales que ya cuentan con formación y quieren
          perfeccionar lo que saben hacer. Máximo 5 participantes, con
          observación individual y corrección técnica.
        </p>
        <ul className="mt-3 divide-y divide-stone-200 border-t border-stone-200 max-w-xl">
          {perfeccionamientoProgramas.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/cursos/${p.slug}`}
                className="flex justify-between gap-4 py-2.5 text-sm group"
              >
                <span className="text-slate-800 group-hover:underline underline-offset-4">
                  {p.title}
                </span>
                <span className="text-stone-400 shrink-0">{p.duration}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    num: "02",
    title: "Actualización Internacional",
    summary: "Referentes mundiales, cada año, para mantenernos a la vanguardia.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
    body: (
      <div>
        <p className="text-stone-600 max-w-xl">
          Desde hace 12 años invitamos cada año a un experto o referente
          internacional a Ecuador para desarrollar una formación exclusiva y
          especializada, acercando nuevas metodologías y tendencias a los
          profesionales del país.
        </p>
      </div>
    ),
  },
  {
    num: "03",
    title: "Consultoría Spa",
    summary: "Creación, gestión y transformación de proyectos Spa & Wellness.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    body: (
      <div>
        <p className="text-stone-600 max-w-xl">
          Experiencia en creación, implementación, reestructuración y
          asesoría de proyectos Spa & Wellness, incluyendo consultoría
          especializada para hotelería y hospitalidad de alto nivel.
        </p>
        <p className="mt-5 text-xs tracking-[0.15em] text-stone-400">
          ÁREAS DE INTERVENCIÓN
        </p>
        <div className="mt-3 flex flex-wrap gap-2 max-w-xl">
          {consultoriaAreas.map((a) => (
            <span
              key={a}
              className="text-sm text-slate-700 bg-stone-100 rounded-full px-3 py-1"
            >
              {a}
            </span>
          ))}
        </div>
        <p className="mt-6 text-xs tracking-[0.15em] text-stone-400">
          PROYECTOS
        </p>
        <ul className="mt-3 text-sm text-slate-700 space-y-1">
          {consultoriaProyectos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    num: "04",
    title: "Talento & Head Hunting",
    summary: "Conectamos profesionales preparados con la industria.",
    icon: (
      <svg {...iconProps}>
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M2.5 20c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
        <path d="M14.5 20c0-2.2 1.6-4 3.7-4s3.8 1.8 3.8 4" />
      </svg>
    ),
    body: (
      <div>
        <p className="text-stone-600 max-w-xl">
          A través de Red Bienestar – Profesionales Ecuador identificamos,
          evaluamos, perfeccionamos y conectamos terapistas de alto
          desempeño con oportunidades dentro de cadenas hoteleras, spas y
          proyectos wellness referentes del sector.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 max-w-xl">
          {talentoCompetencias.map((c) => (
            <div
              key={c}
              className="border border-stone-200 rounded-md px-4 py-3 text-sm text-slate-800"
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function AccordionItem({
  pillar,
  isOpen,
  onToggle,
}: {
  pillar: Pillar;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-5 py-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-lg bg-[#f4f0e7] flex items-center justify-center text-[#0b589c] shrink-0">
          {pillar.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <span className="text-stone-400 text-xs">{pillar.num}</span>
            <h3 className="font-serif text-xl text-slate-900">
              {pillar.title}
            </h3>
          </div>
          <p className="text-stone-500 text-sm mt-1">{pillar.summary}</p>
        </div>
        <span
          className={`text-stone-400 text-xl leading-none pt-1 shrink-0 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen && <div className="pb-8 pl-15">{pillar.body}</div>}
    </div>
  );
}

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#0b589c] text-white text-center py-16 px-6">
        <img
          src="/logo-sandalo.svg"
          alt="Sándalo Center"
          className="h-14 sm:h-16 w-auto mx-auto brightness-0 invert opacity-95"
        />
        <div className="mt-10 max-w-3xl mx-auto">
          <p className="text-blue-100 text-sm sm:text-base">
            Formación y Perfeccionamiento · Actualización Internacional ·
            Consultoría · Talento Spa &amp;&nbsp;Wellness
          </p>
          <p className="font-serif italic text-xl sm:text-2xl mt-9">
            27 años aprendiendo para enseñar, formando para transformar.
          </p>
        </div>
      </header>

      <section className="bg-[#f4f0e7] px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl text-[#0b589c]">{s.value}</p>
              <p className="text-stone-600 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-14 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <img
            src="/cristina.jpg"
            alt="Cristina Muquinche"
            className="w-24 h-24 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="text-xs tracking-[0.2em] text-stone-400 mb-3">
              BIENVENIDA
            </p>
            <blockquote className="font-serif italic text-xl text-slate-900 max-w-xl">
              &ldquo;Hace 27 años comenzó para mí un camino que jamás imaginé
              hasta dónde me llevaría. Sigo aprendiendo cada día, porque
              creo que para enseñar primero hay que estar dispuesto a
              aprender siempre.&rdquo;
            </blockquote>
            <p className="text-stone-500 text-sm mt-3">
              Cristina Muquinche — Directora Académica
            </p>
            <Link
              href="/nosotros"
              className="inline-block mt-5 text-sm text-[#0b589c] underline underline-offset-4 hover:text-slate-900"
            >
              Conoce a Cristina y nuestra historia →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f0e7] px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-stone-400 mb-2">
            NUESTRO ECOSISTEMA
          </p>
          <div className="mt-4">
            {pillars.map((pillar, i) => (
              <AccordionItem
                key={pillar.num}
                pillar={pillar}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Logos de respaldo / alianzas */}
      <section className="px-6 py-14 border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-stone-400 mb-8 text-center">
            CERTIFIQUE SUS CONOCIMIENTOS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            <img
              src="/logos/ministerio-trabajo.png"
              alt="Ministerio del Trabajo - Ecuador"
              className="h-10 sm:h-12 w-auto"
            />
            <img
              src="/logos/wso.png"
              alt="World Spa Organization"
              className="h-10 sm:h-12 w-auto"
            />
            <img
              src="/logos/senescyt.png"
              alt="Senescyt"
              className="h-10 sm:h-12 w-auto"
            />
            <img
              src="/logos/acess.png"
              alt="ACESS"
              className="h-10 sm:h-12 w-auto"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0b589c] text-white text-center px-6 py-16">
        <p className="font-serif text-2xl sm:text-3xl">
          ¿Lista para formarte con nosotros?
        </p>
        <p className="text-blue-100 mt-3">
          Escríbenos y te ayudamos a elegir el programa correcto.
        </p>
        <a
          href="https://wa.me/593995191437"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 bg-white text-[#0b589c] font-medium px-8 py-3 rounded-full hover:bg-blue-50"
        >
          Escríbenos por WhatsApp
        </a>
      </section>

      <footer className="bg-[#094a84] text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-blue-100 mb-4">
            UBICACIÓN Y CONTACTO
          </p>
          <div className="text-blue-50 space-y-1 text-sm">
            <p>Hidalgo de Pinto y Mariano Echeverría, sector Quito Tenis</p>
            <p>0995541081</p>
            <p>info@sandalocenter.com</p>
            <p>Lunes a viernes, 9:00 a 18:00</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a
              href="https://instagram.com/sandalocenter"
              className="text-blue-100 hover:text-white underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              @sandalocenter (Instagram)
            </a>
            <a
              href="https://wa.me/593995191437"
              className="text-blue-100 hover:text-white underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
