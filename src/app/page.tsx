import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">SportBar</h1>
      <p className="text-zinc-500">Find bars showing your sport.</p>
      <div className="flex gap-4">
        <Link
          href="/map"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
        >
          Browse map
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
        >
          Bar owners →
        </Link>
      </div>
    </main>
  );
}
