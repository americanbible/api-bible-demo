import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { VerseContent } from "@/components/VerseContent";
import { Bible, VerseWithVerseContent } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type VersePageProps = {
  params: Promise<{ bibleId: string; verseId: string }>;
};

export default async function VersePage(props: VersePageProps) {
  const { bibleId, verseId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const verse = await makeCachedApiRequest<VerseWithVerseContent>({
    endpoint: `/bibles/${bibleId}/verses/${verseId}`,
    params: {
      "content-type": "html",
      "include-verse-spans": "true",
    },
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
            title: "Verses",
          },
          {
            title: verse.reference,
            href: `/bibles/${bibleId}/verses/${verse.id}`,
          },
        ]}
      />

      <Title page="Verse" title={`${verse.reference} (${verse.id})`} />

      <VerseContent
        linkBase={`/bibles/${bibleId}/verses`}
        verseContent={verse}
      />
    </div>
  );
}
