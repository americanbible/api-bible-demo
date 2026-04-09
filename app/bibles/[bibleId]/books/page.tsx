import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

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
      <BibleInfoHeader
        bible={bible}
        breadcrumbs={[
          {
            title: "Bibles",
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
      <div className="flex flex-col gap-2">
        <Title page="Books" title={`${bible.name} (${books.length})`} />
        <List
          items={books.map((book) => ({
            title: (
              <p>
                <span className="font-bold">{book.nameLong}</span> ({book.id})
              </p>
            ),
            href: `/bibles/${bibleId}/books/${book.id}`,
            info: `${book.chapters.length} chapters`,
          }))}
        />
      </div>
    </div>
  );
}
