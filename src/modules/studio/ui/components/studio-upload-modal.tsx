"use client";

import { ResponsiveModal } from "@/components/resonsive-modal";
import { Button } from "@/components/ui/button";
import { StudioUploader } from "@/modules/studio/ui/components/studio-uploader";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      utils.studio.getMany.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const onSuccess = () => {
    if (!create.data?.video.id) return;
    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };
  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        className="cursor-pointer"
        disabled={create.isPending}
        onClick={() => {
          console.log("created");
          create.mutate();
        }}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
