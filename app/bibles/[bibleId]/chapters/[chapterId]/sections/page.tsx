import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Bible, Chapter, Section } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type SectionsListPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

export default async function SectionsListPage(props: SectionsListPageProps) {
  const { bibleId, chapterId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const chapter = await makeCachedApiRequest<Chapter>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
  });
  const sections = await makeCachedApiRequest<Section[]>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}/sections`,
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
            title: chapter.reference,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
          {
            title: "Sections",
            href: `/bibles/${bibleId}/chapters/${chapter.id}/sections`,
          },
        ]}
      />

      <Title
        page="Sections"
        title={`${chapter.reference} (${sections.length})`}
      />
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
