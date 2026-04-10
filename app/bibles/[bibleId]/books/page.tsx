import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { List } from "@/components/List";
import { Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

type BooksListPageProps = {
  params: Promise<{ bibleId: string }>;
};

export default async function BooksListPage(props: BooksListPageProps) {
  const { bibleId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const books = await makeCachedApiRequest<Book[]>({
    endpoint: `/bibles/${bibleId}/books`,
    params: { "include-chapters": "true" },
  });

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title="Books"
        subtitle={`${books.length}`}
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
        ]}
      />
      <InfoCard
        title="Fetching Books of a Bible"
        url="https://rest.api.bible/v1/bibles/{bibleId}/books"
        info={
          <>
            <p className="mb-2">
              To fetch a list of books for a Bible, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> of the Bible you would like to
              fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/books"
                className="underline"
              >
                Books Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: Using the <code className="font-bold">include-chapters</code>{" "}
              query parameter will allow you to fetch every book and chapter for
              this Bible in a single request.
            </p>
          </>
        }
      />
      <List
        items={books.map((book) => ({
          title: (
            <p>
              <span className="font-bold">{book.name}</span> ({book.id})
            </p>
          ),
          href: `/bibles/${bibleId}/books/${book.id}`,
          info: `${book.chapters.length} chapters`,
        }))}
      />
    </div>
  );
}
