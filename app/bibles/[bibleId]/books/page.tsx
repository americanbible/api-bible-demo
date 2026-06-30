import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { ListSection } from "@/components/sections/ListSection";
import Link from "next/link";
import { Page } from "@/components/Page";
import { client } from "@/utils/api";

export const dynamic = "force-static";

type BooksListPageProps = {
  params: Promise<{ bibleId: string }>;
};

/**
 * Books list page. Renders the full list of books for a given Bible.
 *
 * See our [Books Guide](https://docs.api.bible/guides/books) for more.
 */
export default async function BooksListPage(props: BooksListPageProps) {
  const { bibleId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch full list of books for the given Bible from the `/bibles/{bibleId}/books` endpoint
  const { data: books } = await client.books.list(bibleId, {
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
        ]}
      />
      <InfoSection
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
      <ListSection
        title="Books"
        items={books.map((book) => ({
          title: (
            <p>
              <span className="font-bold">{book.name}</span> ({book.id})
            </p>
          ),
          href: `/bibles/${bibleId}/books/${book.id}`,
          info: `${book.chapters?.length} chapters`,
        }))}
      />
    </Page>
  );
}
