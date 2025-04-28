import { CategoriesSection } from "@/modules/search/uii/section/categries-scetion";
import { ResultsSection } from "@/modules/search/uii/section/result-section";

interface PageProps {
  query: string | undefined;
  categoryId: string | undefined;
}
export const SearchView = ({ query, categoryId }: PageProps) => {
  return (
    <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </div>
  );
};
