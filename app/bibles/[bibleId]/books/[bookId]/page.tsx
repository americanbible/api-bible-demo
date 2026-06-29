import { HeaderSection } from "@/components/sections/HeaderSection";
import { Book as BookIcon, BookText } from "lucide-react";
import { InfoSection } from "@/components/sections/InfoSection";
import Link from "next/link";
import { JSONSection } from "@/components/sections/JSONSection";
import { Page } from "@/components/Page";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";

type BookPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

/**
 * Single book page. Renders resulting book content as JSON.
 *
 * See our [Books Guide](https://docs.api.bible/guides/books) for more.
 */
export default async function BookPage(props: BookPageProps) {
  const params = await props.params;

  return (
    <Suspense fallback={<PageLoader />}>
      <CachedBookPage {...params} />
    </Suspense>
  );
}

async function CachedBookPage({
  bibleId,
  bookId,
}: Awaited<BookPageProps["params"]>) {
  "use cache";
  cacheLife("max");

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single book from the `/bibles/{bibleId}/books/{bookId}` endpoint
  const { data: book } = await client.books.get(bibleId, bookId, {
    includeChapters: true,
  });

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
        ]}
        actionItems={[
          {
            title: "View Chapters",
            href: `/bibles/${bibleId}/books/${bookId}/chapters`,
            children: <BookIcon size={16} />,
          },
          {
            title: "View Sections",
            href: `/bibles/${bibleId}/books/${bookId}/sections`,
            children: <BookText size={16} />,
          },
        ]}
      />
      <InfoSection
        title="Fetching a Single Book"
        url="https://rest.api.bible/v1/bibles/{bibleId}/books/{bookId}"
        info={
          <>
            <p className="mb-2">
              To fetch a single book for a Bible, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Book ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/books"
                className="underline"
              >
                Books Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: If you are having trouble finding the correct <b>Book ID</b>,
              try{" "}
              <Link
                href="https://docs.api.bible/guides/books#fetching-a-list-of-books-for-a-bible"
                className="underline"
              >
                fetching the books in this Bible
              </Link>{" "}
              first.
            </p>
          </>
        }
      />

      <JSONSection
        //Truncate chapter display to reduce page clutter
        json={{ ...book, chapters: `Array(${book.chapters?.length})` }}
      />
    </Page>
  );
}
