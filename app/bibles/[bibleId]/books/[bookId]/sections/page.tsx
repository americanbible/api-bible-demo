import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Section, Bible, Book } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type SectionsListPageProps = {
  params: Promise<{ bibleId: string; bookId: string }>;
};

export default async function BookSectionsListPage(
  props: SectionsListPageProps,
) {
  const { bibleId, bookId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const book = await makeCachedApiRequest<Book>({
    endpoint: `/bibles/${bibleId}/books/${bookId}`,
  });
  const sections = await makeCachedApiRequest<Section[]>({
    endpoint: `/bibles/${bibleId}/books/${bookId}/sections`,
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
            title: "Sections",
            href: `/bibles/${bibleId}/books/${bookId}/sections`,
          },
        ]}
      />
      <Title page="Sections" title={`${book.nameLong} (${sections.length})`} />

      <List
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
    </div>
  );
}
