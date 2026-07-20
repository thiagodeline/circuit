export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Circuit. Organização de torneios de Valorant.</p>
          <p className="font-mono text-xs">Circuit Zen · Temporadas futuras em breve</p>
        </div>
      </div>
    </footer>
  );
}
