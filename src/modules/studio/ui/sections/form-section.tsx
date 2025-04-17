"use client";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyCheckIcon,
  CopyIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { toast } from "sonner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";

interface Props {
  videoId: string;
}

export default function FormSection({ videoId }: Props) {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
const FormSectionSkeleton = () => {
  return <p>Loaing....</p>;
};
function FormSectionSuspense({ videoId }: Props) {
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: video.id });
      toast.success("Updated the video successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });
  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };
  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/video/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={update.isPending}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <TrashIcon className="size-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    {/* add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Add a title to your video" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                    {/* add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={10}
                      className="resize-none pr-10 min-h-[200px]"
                      placeholder="Add a description to your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit p-2">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="px-4 flex flex-col gap-y-6">
                <div className="flex flex-col gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">Video link</p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Link href={`/videos/${video.id}`}>
                      <p className="line-clamp-1 text-sm text-blue-500">
                        {fullUrl}
                      </p>
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={onCopy}
                      disabled={isCopied}
                    >
                      {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="px-4 flex justify-between items-center">
                <div className="flex flex-col gap-y-1">
                  <p className="text-muted-foreground text-xs">Video status</p>
                  <p className="text-sm">
                    {snakeCaseToTitle(video.muxStatus || "preparing")}
                  </p>
                </div>
              </div>
              <div className="px-4 flex justify-between items-center">
                <div className="flex flex-col gap-y-1">
                  <p className="text-muted-foreground text-xs">
                    Subtitles status
                  </p>
                  <p className="text-sm">
                    {snakeCaseToTitle(video.muxTrackStatus || "no_subtitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
