import { Page } from "@/components/Page";
import { BibleSection } from "@/components/sections/BibleSection";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { Bible, Book, Chapter } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

type ChaptersListPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

/**
 * Chapters list page. Renders the full list of chapters for the given book of the Bible.
 *
 * See our [Chapters Guide](https://docs.api.bible/guides/chapters) for more.
 */
export default async function ChaptersListPage(props: ChaptersListPageProps) {
  const { bibleId, bookId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single book from the `/bibles/{bibleId}/books/{bookId}` endpoint
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
  });
  //Fetch full list of chapters for the given book from the `/bibles/{bibleId}/books/{bookId}/chapters` endpoint
  const chapters = await makeCachedApiRequest<Chapter[]>({
    endpoint: `/bibles/${bibleId}/books/${bookId}/chapters`,
  });

  return (
    <Page>
      <HeaderSection
        title={`${book.name} Chapters`}
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
      <BibleSection bible={bible} />
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
