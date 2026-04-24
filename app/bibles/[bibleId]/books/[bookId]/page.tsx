import { HeaderSection } from "@/components/sections/HeaderSection";
import { LinkButton } from "@/components/LinkButton";
import { Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { Book as BookIcon } from "lucide-react";
import { InfoSection } from "@/components/sections/InfoSection";
import Link from "next/link";
import { ActionSection } from "@/components/sections/ActionSection";
import { JSONSection } from "@/components/sections/JSONSection";
import { BibleSection } from "@/components/sections/BibleSection";
import { Page } from "@/components/Page";

type BookPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

/**
 * Single book page. Renders resulting book content as JSON.
 *
 * See our [Books Guide](https://docs.api.bible/guides/books) for more.
 */
export default async function BookPage(props: BookPageProps) {
  const { bibleId, bookId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single book from the `/bibles/{bibleId}/books/{bookId}` endpoint
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
    params: { "include-chapters": "true" },
  });

  return (
    <Page>
      <HeaderSection
        title={book.name}
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
      <BibleSection bible={bible} />
      <ActionSection>
        <LinkButton
          title="View Chapters"
          href={`/bibles/${bibleId}/books/${bookId}/chapters`}
          className="grow border-r-[1px]"
        >
          <BookIcon size={16} />
        </LinkButton>

        <LinkButton
          title="View Sections"
          href={`/bibles/${bibleId}/books/${bookId}/sections`}
          className="grow"
        >
          <BookIcon size={16} />
        </LinkButton>
      </ActionSection>

      <JSONSection
        //Truncate chapter display to reduce page clutter
        json={{ ...book, chapters: `Array(${book.chapters.length})` }}
      />
    </Page>
  );
}
