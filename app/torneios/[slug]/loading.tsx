export default function LoadingTorneio() {
  return (
    <div>
      <div className="border-b border-white/10 px-6 pt-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="skeleton mb-6 h-3 w-40" />
          <div className="pb-10 pt-16 sm:pt-24">
            <div className="skeleton mb-3 h-6 w-40 rounded-full" />
            <div className="skeleton h-12 w-96 max-w-full" />
            <div className="skeleton mt-6 h-4 w-72" />
          </div>
          <div className="skeleton mb-2 h-11 w-80 rounded-2xl" />
          <div className="pb-4" />
        </div>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="skeleton h-48 w-full" />
          <div className="skeleton h-48 w-full" />
          <div className="skeleton h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
