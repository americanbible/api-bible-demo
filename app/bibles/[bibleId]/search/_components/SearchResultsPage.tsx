import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { LinkButton } from "@/components/LinkButton";
import { Bible, SearchResults } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SearchResultsPageProps = {
  bibleId: string;
  page: number;
  searchValue: string;
  searchLink: string;
};

const PAGE_SIZE = 10;

export async function SearchResultsPage({
  bibleId,
  page,
  searchValue,
  searchLink,
}: SearchResultsPageProps) {
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const result = await makeCachedApiRequest<SearchResults>({
    endpoint: `/bibles/${bibleId}/search`,
    params: {
      query: searchValue,
      limit: PAGE_SIZE.toString(),
      offset: (page * PAGE_SIZE).toString(),
    },
  });

  if (result.verses?.length && !result.passages.length) {
    const { offset, total } = result;

    const previousButtonVisible = page > 0;
    const nextButtonVisible = result.verses?.length === PAGE_SIZE;

    return (
      <div className="flex flex-col gap-4">
        <SearchResultHeader
          bible={bible}
          searchLink={searchLink}
          searchValue={searchValue}
        />
        <div className="flex flex-col">
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

        <div className="flex flex-col gap-4 pt-4 border-t-zinc-200 border-t-1">
          {!result.verses?.length && (
            <p className="self-center justify-self-center">No results found.</p>
          )}
          {!!result.verses?.length && (
            <>
              <div className="w-full flex items-center gap-4">
                {previousButtonVisible && (
                  <LinkButton
                    title="Previous Page"
                    href={`/bibles/${bibleId}/search/${searchLink}?page=${page - 1}`}
                  >
                    <ArrowLeft size={16} />
                  </LinkButton>
                )}
                <div className="grow" />
                {nextButtonVisible && (
                  <LinkButton
                    title="Next Page"
                    href={`/bibles/${bibleId}/search/${searchLink}?page=${page + 1}`}
                    className="flex-row-reverse"
                  >
                    <ArrowRight size={16} />
                  </LinkButton>
                )}
              </div>
              <List
                items={result.verses.map((verse) => ({
                  title: (
                    <div className="flex flex-col pb-2">
                      <b className="text-sm">{verse.reference}</b>
                      <p>{verse.text}</p>
                    </div>
                  ),
                  href: `/bibles/${bibleId}/verses/${verse.id}`,
                }))}
              />
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-4">
        <SearchResultHeader
          bible={bible}
          searchLink={searchLink}
          searchValue={searchValue}
        />
        <div className="flex flex-col">
          <p>
            Search Query: <b>{`"${searchValue}"`}</b>
          </p>
          <p>
            Showing <b>{result.passages.length}</b> result(s).
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t-zinc-200 border-t-1">
          {!!result.passages?.length && (
            <>
              <List
                items={result.passages.map((passage) => ({
                  title: (
                    <div className="flex flex-col pb-2">
                      <p className="text-sm">
                        <b>{passage.reference}</b> ({passage.id})
                      </p>
                      <div
                        className="scripture-styles"
                        dangerouslySetInnerHTML={{ __html: passage.content }}
                      />
                    </div>
                  ),
                  href: `/bibles/${bibleId}/passages/${passage.id}`,
                }))}
              />
            </>
          )}
        </div>
      </div>
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
      <BibleInfoHeader
        bible={bible}
        breadcrumbs={[
          {
            title: "Bibles",
            href: "/",
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
      />

      <Title page="Search" title={`${bible.name}`} />
    </>
  );
};
