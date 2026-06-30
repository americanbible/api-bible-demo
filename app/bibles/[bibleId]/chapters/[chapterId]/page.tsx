import { HeaderSection } from "@/components/sections/HeaderSection";
import { VerseContentSection } from "@/components/sections/VerseContentSection";
import { BookText, TextInitial } from "lucide-react";
import Link from "next/link";
import { InfoSection } from "@/components/sections/InfoSection";
import { Page } from "@/components/Page";
import { client } from "@/utils/api";

export const dynamic = "force-static";

type ChapterPageProps = {
  params: Promise<{ bibleId: string; chapterId: string }>;
};

/**
 * Single chapter page. Renders resulting chapter verse content.
 *
 * See our [Chapters Guide](https://docs.api.bible/guides/chapters) for more.
 */
export default async function ChapterPage(props: ChapterPageProps) {
  const { bibleId, chapterId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single chapter from the `/bibles/{bibleId}/chapters/{chapterId}` endpoint
  const { data: chapter } = await client.chapters.get(bibleId, chapterId, {
    contentType: "html",
    includeVerseSpans: true,
    includeTitles: true,
    includeNotes: true,
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
            title: "Chapters",
          },
          {
            title: chapter.reference!,
            href: `/bibles/${bibleId}/chapters/${chapter.id}`,
          },
        ]}
        actionItems={[
          {
            title: "View Verses",
            href: `/bibles/${bibleId}/chapters/${chapterId}/verses`,
            children: <TextInitial size={16} />,
          },
          {
            title: "View Sections",
            href: `/bibles/${bibleId}/chapters/${chapterId}/sections`,
            children: <BookText size={16} />,
          },
        ]}
      />

      <InfoSection
        title="Fetching a Single Chapter"
        url="https://rest.api.bible/v1/bibles/{bibleId}/chapters/{chapterId}"
        info={
          <>
            <p className="mb-2">
              To fetch information for a single chapter, you must send a{" "}
              <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Chapter ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/chapters"
                className="underline"
              >
                Chapters Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: In addition to information about the given chapter, this
              endpoint will also return all verse content included in that
              chapter within the <code className="font-bold">content</code>{" "}
              field. Verse content will be configured based on the given input
              parameters, see our{" "}
              <Link
                href="https://docs.api.bible/guides/verses#verse-content"
                className="underline"
              >
                Verse Content Guide
              </Link>{" "}
              for more.
            </p>
          </>
        }
      />

      <VerseContentSection
        linkBase={`/bibles/${bibleId}/chapters`}
        verseContent={chapter}
        title={chapter.id}
      />
    </Page>
  );
}
