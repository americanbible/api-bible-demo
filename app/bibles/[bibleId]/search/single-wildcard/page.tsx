import { SearchResultsPage } from "../_components/SearchResultsPage";

type SearchPageProps = {
  params: Promise<{ bibleId: string }>;
  searchParams: Promise<{ page: string }>;
};

/**
 * Search page. Searches for the word "l?ve", using the single wildcard string, in the Bible and lists the results.
 *
 * See our [Search Guide](https://docs.api.bible/guides/search) for more.
 */
export default async function NameSearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { bibleId } = await params;
  const { page } = await searchParams;

  return SearchResultsPage({
    bibleId,
    page: Number(page ?? 0),
    searchValue: "l?ve",
    searchLink: "single-wildcard",
  });
}
