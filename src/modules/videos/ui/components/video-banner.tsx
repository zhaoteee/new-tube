import { VideoGetOneOutput } from "@/modules/videos/types";
import { AlertTriangleIcon } from "lucide-react";

export const VideoBanner = ({
  status,
}: {
  status: VideoGetOneOutput["muxStatus"];
}) => {
  if (status === "ready") return null;
  return (
    <div className="bg-yellow-500 py-2 px-4 rounded-b-xl flex items-center gap-2">
      <AlertTriangleIcon className="size-4 text-black shrink-0" />
      <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
        This video is still being processed.
      </p>
    </div>
  );
};
