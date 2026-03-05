export function SkeletonCard() {
  return (
    <div className="bg-crypt border border-iron rounded-[2px] overflow-hidden animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-ash" />
      <hr className="border-iron m-0" />
      <div className="p-4 space-y-3">
        {/* Meta line */}
        <div className="flex gap-2">
          <div className="h-3 w-24 bg-ash rounded" />
          <div className="h-3 w-12 bg-ash rounded" />
        </div>
        {/* Headline */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-ash rounded" />
          <div className="h-5 w-3/4 bg-ash rounded" />
        </div>
        {/* Excerpt */}
        <div className="h-3 w-full bg-ash rounded" />
      </div>
    </div>
  );
}
