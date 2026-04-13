import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { VerseContent } from "@/components/VerseContent";
import { Bible, SectionWithVerseContent } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";

type SectionPageProps = {
  params: Promise<{ bibleId: string; sectionId: string }>;
};

/**
 * Single section page. Renders resulting section verse content.
 *
 * See our [Sections Guide](https://docs.api.bible/guides/sections) for more.
 */
export default async function SectionPage(props: SectionPageProps) {
  const { bibleId, sectionId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single section from the `/bibles/{bibleId}/sections/{sectionId}` endpoint
  const section = await makeCachedApiRequest<SectionWithVerseContent>({
    endpoint: `/bibles/${bibleId}/sections/${sectionId}`,
    params: {
      "content-type": "html",
      "include-verse-spans": "true",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title={section.title}
        breadcrumbs={[
          {
            title: "Home",
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

      <InfoCard
        title="Fetching a Single Section"
        url="https://rest.api.bible/v1/bibles/{bibleId}/sections/{sectionId}"
        info={
          <>
            <p className="mb-2">
              To fetch information and content for a single section, you must
              send a <code className="font-bold">GET</code> request to the above
              API endpoint using the <b>Bible ID</b> and <b>Sections ID</b> you
              would like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/sections"
                className="underline"
              >
                Sections Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: This endpoint will also return verse content within the{" "}
              <code className="font-bold">content</code> field. Verse content
              can be configured based on the given input parameters, see our{" "}
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
      <div className="w-full pb-4 border-zinc-200 border-b-1" />
      <VerseContent
        linkBase={`/bibles/${bibleId}/sections`}
        verseContent={section}
      />
    </div>
  );
}
