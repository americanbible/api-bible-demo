import { HeaderSection } from "@/components/sections/HeaderSection";
import { ListSection } from "@/components/sections/ListSection";
import { LinkButton } from "@/components/LinkButton";
import { ArrowLeftCircle, ArrowRightCircle, Search } from "lucide-react";
import Link from "next/link";
import { InfoSection } from "@/components/sections/InfoSection";
import { Page } from "@/components/Page";
import { Spacer } from "@/components/Spacer";
import { client } from "@/utils/api";
import { Bible } from "@americanbible/api-bible-sdk";

export const dynamic = "force-static";

type SearchResultsPageProps = {
  bibleId: string;
  page: number;
  searchValue: string;
  searchLink: string;
};

const PAGE_SIZE = 10;

/**
 * Componentized search results page. Executes a search and lists all content returned.
 * If a passage is searched, it will display those results properly as well.
 *
 * See our [Search Guide](https://docs.api.bible/guides/search) for more.
 */
export async function SearchResultsPage({
  bibleId,
  page,
  searchValue,
  searchLink,
}: SearchResultsPageProps) {
  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Execute a search with the given query using the `/bibles/{bibleId}/search?query={query}` endpoint
  const { data: result } = await client.search.search(bibleId, {
    query: searchValue,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  if (result.verses?.length && !result.passages?.length) {
    const { offset, total } = result;

    const previousButtonVisible = page > 0;
    const nextButtonVisible = result.verses?.length === PAGE_SIZE;

    return (
      <Page>
        <SearchResultHeader
          bible={bible}
          searchLink={searchLink}
          searchValue={searchValue}
        />
        <div className="w-full h-8" />
        <div className="flex items-end border-black border-b-[1px] px-0 sm:px-8 sticky top-[-1px] bg-white">
          <div className="flex flex-col border-x-[1px] border-t-[1px] px-4 py-2">
            <p>
              Search Query: <b>{`"${searchValue}"`}</b>
            </p>
            <p>
              Showing{" "}
              <b>
                {offset + 1}-{offset + 10 > total ? total : offset + 10}
              </b>{" "}
              of <b>{total}</b> result(s).
            </p>
          </div>

          <div className="grow" />
          {previousButtonVisible && (
            <>
              <LinkButton
                className="sm:hidden border-x-[1px] border-t-[1px] h-full"
                href={`/bibles/${bibleId}/search/${searchLink}?page=${page - 1}`}
                title=""
              >
                <ArrowLeftCircle size={16} />
              </LinkButton>
              <LinkButton
                className="hidden sm:flex border-x-[1px] border-t-[1px] h-full"
                href={`/bibles/${bibleId}/search/${searchLink}?page=${page - 1}`}
                title="Previous"
              />
            </>
          )}
          {nextButtonVisible && (
            <>
              <LinkButton
                className={`sm:hidden border-r-[1px] border-t-[1px] h-full ${!previousButtonVisible ? "border-l-[1px]" : ""}`}
                href={`/bibles/${bibleId}/search/${searchLink}?page=${page + 1}`}
                title=""
              >
                <ArrowRightCircle size={16} />
              </LinkButton>
              <LinkButton
                className={`hidden sm:flex border-r-[1px] border-t-[1px] h-full ${!previousButtonVisible ? "border-l-[1px]" : ""}`}
                href={`/bibles/${bibleId}/search/${searchLink}?page=${page + 1}`}
                title="Next"
              />
            </>
          )}
        </div>
        <div className="flex border-b-[1px] ">
          <Spacer />
        </div>

        <div className="flex flex-col gap-4">
          {!result.verses?.length && (
            <p className="self-center justify-self-center">No results found.</p>
          )}
          {!!result.verses?.length && (
            <ListSection
              hideHeader
              items={result.verses.map((verse) => ({
                title: (
                  <div className="flex flex-col pb-2">
                    <b className="text-sm">{verse.reference}</b>
                    <p>{verse.text}</p>
                  </div>
                ),
                info: verse.id,
                href: `/bibles/${bibleId}/verses/${verse.id}`,
              }))}
            />
          )}
        </div>
      </Page>
    );
  } else {
    return (
      <Page>
        <SearchResultHeader
          bible={bible}
          searchLink={searchLink}
          searchValue={searchValue}
        />
        <div className="flex border-b-[1px]">
          <Spacer />
          <div className="flex flex-col border-r-[1px] px-4 py-2">
            <p>
              Search Query: <b>{`"${searchValue}"`}</b>
            </p>
            <p>
              Showing <b>{result.passages?.length}</b> result(s).
            </p>
          </div>
        </div>

        {!!result.passages?.length && (
          <>
            <ListSection
              hideHeader
              items={result.passages.map((passage) => ({
                title: (
                  <div className="flex flex-col pb-2">
                    <p className="text-sm">
                      <b>{passage.reference}</b>
                    </p>
                    <div
                      className="scripture-styles"
                      dangerouslySetInnerHTML={{ __html: passage.content }}
                    />
                  </div>
                ),
                info: passage.id,
                href: `/bibles/${bibleId}/passages/${passage.id}`,
              }))}
            />
          </>
        )}
      </Page>
    );
  }
}

type SearchResultHeaderProps = {
  bible: Bible;
  searchValue: string;
  searchLink: string;
};
const SearchResultHeader = ({
  bible,
  searchValue,
  searchLink,
}: SearchResultHeaderProps) => {
  return (
    <>
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
            href: `/bibles/${bible.id}`,
          },
          {
            title: "Search",
            href: `/bibles/${bible.id}/search`,
          },
          {
            title: searchValue,
            href: `/bibles/${bible.id}/search/${searchLink}`,
          },
        ]}
        actionItems={[
          {
            title: "Choose Another Query",
            href: `/bibles/${bible.id}/search`,
            children: <Search size={16} />,
          },
        ]}
      />
      <InfoSection
        title="Searching a Bible"
        url="https://rest.api.bible/v1/bibles/{bibleId}/search?query={query}"
        info={
          <>
            <p className="mb-2">
              To search within a Bible, you must send a GET request to the above
              API endpoint using the appropriate <b>Bible ID</b> and search
              terms (in the <code className="font-bold">query</code> query
              parameter) you are looking to find. For more information, check
              out our{" "}
              <Link
                href="https://docs.api.bible/guides/search"
                className="underline"
              >
                Search Guide
              </Link>
              .
            </p>
            <p className="text-sm">
              Tip: The <code className="font-bold">text</code> property of each
              search result contains only the verse text, it does not contain
              footnote references or additional formatting. However, more
              information on a verse can be queried directly by{" "}
              <Link
                href="https://docs.api.bible/guides/verses#fetching-a-single-verse"
                className="underline"
              >
                fetching a single verse
              </Link>
              .
            </p>
          </>
        }
      />
    </>
  );
};
