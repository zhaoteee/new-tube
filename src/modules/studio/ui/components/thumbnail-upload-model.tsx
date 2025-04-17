import { ResponsiveModal } from "@/components/resonsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface UploadProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: UploadProps) => {
  const utils = trpc.useUtils();
  const onUploadComplete = () => {
    utils.studio.getOne.invalidate({ id: videoId });
    utils.studio.getMany.invalidate();
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload a thumbnail"
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
