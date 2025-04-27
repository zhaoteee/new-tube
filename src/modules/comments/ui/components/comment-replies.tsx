import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constant";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";

export const CommentReplies = ({
  parentId,
  videoId,
}: {
  parentId: string;
  videoId: string;
}) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  return (
    <div className="pl-14">
      <div className="flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} variant="reply" />
            ))}
        {hasNextPage && (
          <Button
            size="sm"
            variant="tertiary"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            加载更多
          </Button>
        )}
      </div>
    </div>
  );
};
