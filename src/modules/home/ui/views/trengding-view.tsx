import { TrendingVideosSection } from "@/modules/home/ui/sections/trending-videos-section";

export default function TrendingView() {
  return (
    <div className="max-w-[2400px] mx-auto px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-xs text-muted-foreground">
          Most popular videos at the moment
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
}
