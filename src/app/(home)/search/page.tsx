export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const { query, categoryId } = await searchParams;

  return (
    <div>
      {query}={categoryId}
    </div>
  );
}
