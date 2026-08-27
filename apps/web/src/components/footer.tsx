export default function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-on-surface-muted">
        <p>
          &copy; {new Date().getFullYear()} Wyven Technologies (Private) Limited. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
