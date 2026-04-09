import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { VerseContent } from "@/components/VerseContent";
import { LinkButton } from "@/components/LinkButton";
import { Bible, ChapterWithVerseContent } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { BookIcon, TextInitial } from "lucide-react";

type ChapterPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

export default async function ChapterPage(props: ChapterPageProps) {
  const { bibleId, chapterId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const chapter = await makeCachedApiRequest<ChapterWithVerseContent>({
    endpoint: `/bibles/${bibleId}/chapters/${chapterId}`,
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
            title: "Chapters",
          },
          {
            title: chapter.reference,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
        ]}
      />

      <Title page="Chapter" title={`${chapter.reference} (${chapter.id})`} />

      <div className="flex gap-4">
        <LinkButton
          title="View Verses"
          href={`/bibles/${bibleId}/chapters/${chapterId}/verses`}
        >
          <TextInitial size={16} />
        </LinkButton>

        <LinkButton
          title="View Sections"
          href={`/bibles/${bibleId}/chapters/${chapterId}/sections`}
        >
          <BookIcon size={16} />
        </LinkButton>
      </div>

      <VerseContent
        linkBase={`/bibles/${bibleId}/chapters`}
        verseContent={chapter}
      />
    </div>
  );
}
