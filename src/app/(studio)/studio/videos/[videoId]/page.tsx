import VideoView from "@/modules/studio/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";
interface PageProps {
  params: Promise<{ videoId: string }>;
}
export default async function Page({ params }: PageProps) {
  const { videoId } = await params;
  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}
