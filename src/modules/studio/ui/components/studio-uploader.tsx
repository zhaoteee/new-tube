import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderFileSelect,
  MuxUploaderDrop,
  MuxUploaderStatus,
  MuxUploaderProgress,
  MuxUploaderRetry,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";
interface StudioUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}
const UPLOAD_ID = "mux_uploader_id";
export const StudioUploader = ({
  endpoint,
  onSuccess,
}: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader
        onSuccess={onSuccess}
        id={UPLOAD_ID}
        className="hidden group/uploader"
        endpoint={endpoint}
      />
      <MuxUploaderDrop muxUploader={UPLOAD_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32">
            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drag and drop video files to upload</p>
            <p className="text-xs text-muted-foreground">
              Your videos will be private until you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOAD_ID}>
            <Button type="button" className="rounded-full">
              Select files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden"></span>
        <MuxUploaderStatus muxUploader={UPLOAD_ID} className="text-sm" />
        <MuxUploaderProgress
          muxUploader={UPLOAD_ID}
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress muxUploader={UPLOAD_ID} type="bar" />
        <MuxUploaderRetry muxUploader={UPLOAD_ID} />
      </MuxUploaderDrop>
    </div>
  );
};
