import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Bible, Book, Chapter } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type ChaptersListPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

export default async function ChaptersListPage(props: ChaptersListPageProps) {
  const { bibleId, bookId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
  });
  const chapters = await makeCachedApiRequest<Chapter[]>({
    endpoint: `/bibles/${bibleId}/books/${bookId}/chapters`,
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
          {
            title: book.nameLong,
            href: `/bibles/${bibleId}/books/${bookId}`,
          },

          {
            title: "Chapters",
            href: `/bibles/${bibleId}/books/${bookId}/chapters`,
          },
        ]}
      />
      <Title page="Chapters" title={`${book.nameLong} (${chapters.length})`} />
      <List
        items={chapters.map((chapter) => ({
          title: (
            <p>
              <span className="font-bold">
                {book.nameLong} {chapter.number}
              </span>{" "}
              ({chapter.id})
            </p>
          ),
          href: `/bibles/${bibleId}/chapters/${chapter.id}`,
        }))}
      />
    </div>
  );
}
