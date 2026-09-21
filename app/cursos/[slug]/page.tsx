import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "../data";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#0b589c] text-white px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-sm text-blue-100 hover:text-white underline underline-offset-4"
          >
            ← Volver
          </Link>
          <p className="text-xs tracking-[0.2em] text-blue-100 mt-6">
            {course.pillarNum} · {course.pillarTitle}
          </p>
          <h1 className="font-serif text-3xl mt-3">{course.title}</h1>
          <p className="text-blue-100 mt-2">{course.duration}</p>
        </div>
      </header>
      <section className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-stone-600 text-lg leading-relaxed">
          {course.description}
        </p>
      </section>
    </main>
  );
}
