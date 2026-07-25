export default function LoadingTime() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center gap-5">
        <div className="skeleton h-20 w-20 rounded-xl" />
        <div>
          <div className="skeleton mb-2 h-3 w-16" />
          <div className="skeleton h-8 w-56" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-xs">
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
      </div>
      <div className="mt-14 space-y-2">
        <div className="skeleton h-16 w-full" />
        <div className="skeleton h-16 w-full" />
        <div className="skeleton h-16 w-full" />
      </div>
    </div>
  );
}
