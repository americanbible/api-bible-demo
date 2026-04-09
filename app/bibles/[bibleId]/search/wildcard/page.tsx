import { SearchResultsPage } from "../_components/SearchResultsPage";

type SearchPageProps = {
  params: Promise<{ bibleId: string }>;
  searchParams: Promise<{ page: string }>;
};

export default async function NameSearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { bibleId } = await params;
  const { page } = await searchParams;

  return SearchResultsPage({
    bibleId,
    page: Number(page ?? 0),
    searchValue: "wo*d",
    searchLink: "wildcard",
  });
}
