import FormSection from "@/modules/studio/ui/sections/form-section";

interface VideoViewProps {
  videoId: string;
}
export default function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="p-6">
      <FormSection videoId={videoId} />
    </div>
  );
}
