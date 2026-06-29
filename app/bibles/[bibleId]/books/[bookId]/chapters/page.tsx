import { Page } from "@/components/Page";
import PageLoader from "@/components/PageLoader";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

type ChaptersListPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

/**
 * Chapters list page. Renders the full list of chapters for the given book of the Bible.
 *
 * See our [Chapters Guide](https://docs.api.bible/guides/chapters) for more.
 */
export default async function ChaptersListPage(props: ChaptersListPageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PageLoader />}>
      <CachedChaptersListPage {...params} />
    </Suspense>
  );
}

async function CachedChaptersListPage({
  bibleId,
  bookId,
}: Awaited<ChaptersListPageProps["params"]>) {
  "use cache";
  cacheLife("max");

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single book from the `/bibles/{bibleId}/books/{bookId}` endpoint
  const { data: book } = await client.books.get(bibleId, bookId);
  //Fetch full list of chapters for the given book from the `/bibles/{bibleId}/books/{bookId}/chapters` endpoint
  const { data: chapters } = await client.chapters.list(bibleId, bookId);

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
            title: "Books",
            href: `/bibles/${bibleId}/books`,
          },
          {
            title: book.name,
            href: `/bibles/${bibleId}/books/${bookId}`,
          },

          {
            title: "Chapters",
            href: `/bibles/${bibleId}/books/${bookId}/chapters`,
          },
        ]}
      />
      <InfoSection
        title="Fetching Chapters of a Book"
        url="https://rest.api.bible/v1/bibles/{bibleId}/books/{bookId}/chapters"
        info={
          <>
            <p className="mb-2">
              To fetch a list of chapters for a book of the Bible, you must send
              a <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Book ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/chapters"
                className="underline"
              >
                Chapters Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: You may also use the{" "}
              <code className="font-bold">/books</code> endpoint to fetch
              chapter data using the{" "}
              <code className="font-bold">include-chapters</code> query
              parameter. For more, see our guide on{" "}
              <Link
                href="https://docs.api.bible/guides/books#fetching-a-list-of-books-for-a-bible"
                className="underline"
              >
                Fetching a List of Books for a Bible
              </Link>
              .
            </p>
          </>
        }
      />
      <ListSection
        title="Chapters"
        items={chapters.map((chapter) => ({
          title: (
            <p className="font-bold">
              {book.name} {chapter.number}
            </p>
          ),
          info: chapter.id,
          href: `/bibles/${bibleId}/chapters/${chapter.id}`,
        }))}
      />
    </Page>
  );
}
