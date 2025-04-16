import HomeView from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  await trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
