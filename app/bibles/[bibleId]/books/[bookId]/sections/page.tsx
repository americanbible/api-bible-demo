import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import { Section, Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";
import { Page } from "@/components/Page";

type SectionsListPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

/**
 * Sections list page. Renders the full list of sections for the given book of the Bible.
 *
 * See our [Sections Guide](https://docs.api.bible/guides/sections) for more.
 */
export default async function BookSectionsListPage(
  props: SectionsListPageProps,
) {
  const { bibleId, bookId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single book from the `/bibles/{bibleId}/books/{bookId}` endpoint
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
  });
  //Fetch full list of sections for the given book from the `/bibles/{bibleId}/books/{bookId}/sections` endpoint
  const sections = await makeCachedApiRequest<Section[]>({
    endpoint: `/bibles/${bibleId}/books/${bookId}/sections`,
  }).catch(() => [] as Section[]);

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
            title: "Sections",
            href: `/bibles/${bibleId}/books/${bookId}/sections`,
          },
        ]}
      />
      <InfoSection
        title="Fetching Sections in a Book"
        url="https://rest.api.bible/v1/bibles/{bibleId}/books/{bookId}/sections"
        info={
          <>
            <p className="mb-2">
              To fetch a list of sections for a book of the Bible, you must send
              a <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Book ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/sections"
                className="underline"
              >
                Sections Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: Not every Bible has sections available. You can use the{" "}
              <code className="font-bold">/books</code> endpoint to check for
              section data using the{" "}
              <code className="font-bold">include-chapters-and-sections</code>{" "}
              query parameter. For more, see our guide on{" "}
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
        items={sections.map((section) => ({
          title: (
            <p>
              <span className="font-bold">{section.title}</span> ({section.id})
            </p>
          ),
          href: `/bibles/${bibleId}/sections/${section.id}`,
          info: `${section.firstVerseId} - ${section.lastVerseId}`,
        }))}
      />
    </Page>
  );
}
