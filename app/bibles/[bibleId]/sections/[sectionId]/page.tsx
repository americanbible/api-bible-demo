import { Page } from "@/components/Page";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { VerseContentSection } from "@/components/sections/VerseContentSection";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
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
  "use cache";
  cacheLife("max");
  const { bibleId, sectionId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single section from the `/bibles/{bibleId}/sections/{sectionId}` endpoint
  const { data: section } = await client.sections.get(bibleId, sectionId, {
    contentType: "html",
    includeVerseSpans: true,
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
            title: "Sections",
          },
          {
            title: section.title!,
            href: `/bibles/${bibleId}/sections/${section.id}`,
          },
        ]}
      />

      <InfoSection
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
      <VerseContentSection
        linkBase={`/bibles/${bibleId}/sections`}
        verseContent={section}
        title={section.id}
      />
    </Page>
  );
}
