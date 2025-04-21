import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId });
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
