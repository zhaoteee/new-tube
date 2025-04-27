import { CommentsSection } from "@/modules/videos/ui/sections/comments-section";
import { SuggestionsSection } from "@/modules/videos/ui/sections/suggestions-section";
import { VideoSection } from "@/modules/videos/ui/sections/video-section";

export const VideoView = ({ videoId }: { videoId: string }) => {
  return (
    <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <SuggestionsSection videoId={videoId} isManual />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};
