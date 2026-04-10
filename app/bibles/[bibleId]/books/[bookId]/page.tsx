import { Header } from "@/components/Header";
import { LinkButton } from "@/components/LinkButton";
import { Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { Book as BookIcon } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import Link from "next/link";
import { ActionList } from "@/components/ActionList";
import { JSONContent } from "@/components/JSONContent";

type BookPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

export default async function BookPage(props: BookPageProps) {
  const { bibleId, bookId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
    params: { "include-chapters": "true" },
  });
  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title={book.name}
        subtitle={book.id}
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
            title: "Books",
            href: `/bibles/${bibleId}/books`,
          },
          {
            title: book.name,
            href: `/bibles/${bibleId}/books/${bookId}`,
          },
        ]}
      />
      <InfoCard
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
      <ActionList>
        <LinkButton
          title="View Chapters"
          href={`/bibles/${bibleId}/books/${bookId}/chapters`}
        >
          <BookIcon size={16} />
        </LinkButton>

        <LinkButton
          title="View Sections"
          href={`/bibles/${bibleId}/books/${bookId}/sections`}
        >
          <BookIcon size={16} />
        </LinkButton>
      </ActionList>

      <JSONContent json={book} />
    </div>
  );
}
