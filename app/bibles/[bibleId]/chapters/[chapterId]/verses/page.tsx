import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { List } from "@/components/List";
import { Title } from "@/components/Title";
import { Bible, Chapter, Verse } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type VersesListPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

export default async function VersesListPage(props: VersesListPageProps) {
  const { bibleId, chapterId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const chapter = await makeCachedApiRequest<Chapter>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
  });
  const verses = await makeCachedApiRequest<Verse[]>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}/verses`,
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
            title: "Verses",
            href: `/bibles/${bibleId}/chapters/${chapter.id}/verses`,
          },
        ]}
      />

      <Title page="Verses" title={`${chapter.reference} (${verses.length})`} />
      <List
        items={verses.map((verse) => ({
          title: (
            <p>
              <span className="font-bold">{verse.reference}</span> ({verse.id})
            </p>
          ),
          href: `/bibles/${bibleId}/verses/${verse.id}`,
        }))}
      />
    </div>
  );
}
