export default function LoadingRanking() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="skeleton mb-2 h-3 w-40" />
      <div className="skeleton h-9 w-56" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      <div className="mt-10 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
