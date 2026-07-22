export default function LoadingNoticias() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="skeleton mb-2 h-3 w-16" />
      <div className="skeleton h-9 w-48" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[16/10] w-full" />
        ))}
      </div>
    </div>
  );
}
