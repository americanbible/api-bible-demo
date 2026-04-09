import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { VerseContent } from "@/components/VerseContent";
import { Bible, SectionWithVerseContent } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type SectionPageProps = {
  params: Promise<{ bibleId: string; sectionId: string }>;
};

export default async function SectionPage(props: SectionPageProps) {
  const { bibleId, sectionId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  const section = await makeCachedApiRequest<SectionWithVerseContent>({
    endpoint: `/bibles/${bibleId}/sections/${sectionId}`,
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
            title: "Sections",
          },
          {
            title: section.title,
            href: `/bibles/${bibleId}/sections/${section.id}`,
          },
        ]}
      />

      <Title page="Section" title={`${section.title} (${section.id})`} />

      <VerseContent
        linkBase={`/bibles/${bibleId}/sections`}
        verseContent={section}
      />
    </div>
  );
}
