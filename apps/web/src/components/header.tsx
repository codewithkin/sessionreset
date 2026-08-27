import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          Session<span className="text-primary">Reset</span>
        </Link>
        <nav className="flex gap-4 text-sm text-on-surface-muted">
          <Link href="/privacy" className="transition-colors hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-primary">
            Terms
          </Link>
        </nav>
      </div>
    </header>
  );
}
