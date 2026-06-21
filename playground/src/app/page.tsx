import Link from "next/link";
import { designSystems } from "@/lib/catalog";

export default function HomePage() {
  return (
    <main className="min-h-screen p-10 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="typo-hero">Forgekit</h1>
        <p className="typo-body text-[var(--muted-foreground)] mt-1">
          Design system catalog
        </p>
      </header>

      <section>
        <h2 className="typo-section-label text-[var(--muted-foreground)] mb-4">
          Design Systems
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designSystems.map((ds) => (
            <Link key={ds.slug} href={`/ds/${ds.slug}`} className="group block">
              <div className="p-6 rounded-xl ring-1 ring-[var(--border)] hover:ring-[var(--foreground)]/20 hover:bg-[var(--accent)] transition-all">
                <p className="typo-card-title">{ds.name}</p>
                <p className="typo-caption mt-1 line-clamp-2">{ds.description}</p>
                <span className="typo-badge text-[var(--muted-foreground)] mt-4 block">
                  v{ds.version}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
