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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
interface CreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const formSchema = z.object({
  name: z.string().min(1),
});
export const PlaylistsCreateModal = ({ open, onOpenChange }: CreateProps) => {
  const utils = trpc.useUtils();
  const createdPlaylists = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.info("Playlist created");
      utils.playlists.getMany.invalidate();
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createdPlaylists.mutate({
      name: values.name,
    });
  };
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create a playlist"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favorate videos"></Input>
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <div className="flex justify-end mt-2">
            <Button type="submit" disabled={createdPlaylists.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
