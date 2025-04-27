"use client";

import { DEFAULT_LIMIT } from "@/constant";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

export const SuggestionsSection = ({ videoId }: { videoId: string }) => {
  const { data } = trpc.suggestions.getMany.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastpage) => lastpage.nextCursor }
  );
  return (
    <div>
      {data?.pages
        .flatMap((page) => page.items)
        .map((item) => (
          <VideoRowCard data={item} key={item.id} size="default" />
        ))}
    </div>
  );
};
