export default function LoadingHome() {
  return (
    <div>
      <div className="border-b border-white/10 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="skeleton mb-3 h-3 w-24" />
          <div className="skeleton h-9 w-56" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="skeleton mb-4 h-3 w-20" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="skeleton aspect-[21/8] w-full md:col-span-2" />
          <div className="skeleton aspect-[21/9] w-full" />
          <div className="skeleton aspect-[21/9] w-full" />
        </div>
      </div>
    </div>
  );
}
