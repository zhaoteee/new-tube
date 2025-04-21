"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  legacyBehavior
                  href={`/studio/videos/${video.id}`}
                  key={video.id}
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="pl-6 ">
                      <div className="flex items-center gap-4">
                        <div className="reletive aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            duration={video.duration}
                            title={video.title}
                            imgUrl={video.thumbnailUrl || ""}
                            previewUrl={video.previewUrl}
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden gap-y-1 w-xl">
                          <span className="text-sm line-clamp-1 text-ellipsis">
                            {video.title}
                          </span>
                          <span className="text-xs text-muted-foreground  truncate">
                            {video.description || "No description"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{snakeCaseToTitle(video.visibility)}</TableCell>
                    <TableCell>
                      {snakeCaseToTitle(video.muxStatus || "error")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(video.createdAt), "d MM yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-sm">22</TableCell>
                    <TableCell className="text-right text-sm">333</TableCell>
                    <TableCell className="text-right text-sm pr-6">
                      444
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      ></InfiniteScroll>
    </div>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow className="cursor-pointer" key={index}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-36" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right text-sm">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="text-right text-sm">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right text-sm pr-6">
                <Skeleton className="h-4 w-18" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
