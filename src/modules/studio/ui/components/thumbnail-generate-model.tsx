import { ResponsiveModal } from "@/components/resonsive-modal";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface GenerateProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const formSchema = z.object({
  prompt: z.string().min(10),
});
export const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChange,
}: GenerateProps) => {
  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.info("Generating thumbnail from background", {
        description: "This may take a while, please wait",
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "美丽的自然风景,要有高山流水" },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      prompt: values.prompt,
      id: videoId,
    });
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Generate a thumbnail"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="resize-none"
                    cols={30}
                    rows={5}
                    placeholder="A description of wanted thunbnail"
                  ></Textarea>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <div className="flex justify-end">
            <Button type="submit" disabled={generateThumbnail.isPending}>
              Generate
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
