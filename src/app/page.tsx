import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          CareerSaathi · करियर साथी
        </span>
        <h1 className="text-3xl font-bold tracking-tight">
          Find the right vocational path for your future
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Simple guidance for students and parents in English and regional
          languages. Compare real local outcomes and plan your career together.
        </p>
      </div>

      <div className="pt-2 w-full max-w-xs">
        <Link
          href="/onboarding"
          className="flex items-center justify-center w-full h-12 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          Start Free Onboarding →
        </Link>
      </div>
    </main>
  );
}
