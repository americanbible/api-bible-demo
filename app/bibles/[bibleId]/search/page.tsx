import { Header } from "@/components/Header";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { LinkButton } from "@/components/LinkButton";
import { Search } from "lucide-react";
import { ActionList } from "@/components/ActionList";
import { InfoCard } from "@/components/InfoCard";
import Link from "next/link";

type SearchPageProps = {
  params: Promise<{ bibleId: string }>;
};

export default async function SearchPage(props: SearchPageProps) {
  const { bibleId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });

  const values = [
    ["Aaron", "name"],
    ["l?ve", "single-wildcard"],
    ["wo*d", "wildcard"],
    ["John 3:16-19", "verse-range"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title="Search"
        breadcrumbs={[
          {
            title: "Home",
            href: "/",
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
      />

      <InfoCard
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

      <ActionList>
        {values.map(([value, href]) => (
          <LinkButton
            key={value}
            href={`/bibles/${bibleId}/search/${href}`}
            title={`Search "${value}"`}
          >
            <Search size={16} className="mr-1" />
          </LinkButton>
        ))}
      </ActionList>

      <p className="text-sm">
        To avoid API abuse, our search demo is currently limited to a predefined
        set of search values. Click one of the above options to test our search
        feature.
      </p>
    </div>
  );
}
