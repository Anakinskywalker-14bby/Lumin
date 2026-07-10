import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-on-surface-variant">
            Clinical-grade AI skin intelligence with a whole-food heart.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-on-surface-variant md:text-right">
          <a href="#world" className="hover:text-primary">Brand World</a>
          <a href="#configure" className="hover:text-primary">Your Ritual</a>
          <a href="#science" className="hover:text-primary">The Science</a>
        </div>
      </div>
      <div className="border-t border-primary/10 py-5">
        <p className="mx-auto max-w-6xl px-4 font-label text-label-sm text-outline md:px-8">
          © {new Date().getFullYear()} LUMIN LABS · RESULTS NOT MEDICAL ADVICE ·
          SCANS PROCESSED, NEVER RETAINED
        </p>
      </div>
    </footer>
  );
}
