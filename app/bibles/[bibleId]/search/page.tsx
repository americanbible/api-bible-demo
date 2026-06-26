import { HeaderSection } from "@/components/sections/HeaderSection";
import { Search } from "lucide-react";
import { InfoSection } from "@/components/sections/InfoSection";
import Link from "next/link";
import { Page } from "@/components/Page";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";

type SearchPageProps = {
  params: Promise<{ bibleId: string }>;
};

/**
 * Search selection page. Provides a list of preselected search options for the user to test out our search functionality.
 *
 * See our [Search Guide](https://docs.api.bible/guides/search) for more.
 *
 * *Note: You cannot call the  `/search` endpoint in the API without a `query` attached to it, this is simply a utility page to reduce API usage.*
 */
export default async function SearchPage(props: SearchPageProps) {
  "use cache";
  cacheLife("max");
  const { bibleId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);

  const values = [
    ["Aaron", "name"],
    ["l?ve", "single-wildcard"],
    ["wo*d", "wildcard"],
    ["John 3:16-19", "verse-range"],
  ];

  return (
    <Page>
      <HeaderSection
        bible={bible}
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
          },
          {
            title: "Bibles",
            href: "/bibles",
          },
          {
            title: bible.name,
            href: `/bibles/${bibleId}`,
          },
          {
            title: "Search",
            href: `/bibles/${bibleId}/search`,
          },
        ]}
        actionItems={values.map(([value, href]) => ({
          title: `Search "${value}"`,
          href: `/bibles/${bibleId}/search/${href}`,
          children: <Search size={16} className="mr-1" />,
        }))}
      />

      <InfoSection
        title="How To Search"
        info={
          <>
            <p className="mb-2">
              A search will attempt to match all verses with the list of
              keywords provided in the query string. You may include either a
              verse range (i.e. {'"John 3:16-19"'}) a keyword (i.e. {'"love"'}),
              or a comma-separated list of keywords (i.e. {'"love,world"'}). The
              order of the keywords does not matter, however{" "}
              <i>
                all listed keywords must be present in a verse for it to be
                considered a match
              </i>
              . If a verse range is provided instead of search keywords, the
              resulting <b>passage</b> will be returned instead. For more
              information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/search"
                className="underline"
              >
                Search Guide
              </Link>
              .
            </p>
            <p className="text-sm">
              Tip: Wildcard searches are supported using{" "}
              <code className="font-bold">*</code> (match any number of
              characters) or <code className="font-bold">?</code> (match one
              character).
            </p>
          </>
        }
      />
    </Page>
  );
}
