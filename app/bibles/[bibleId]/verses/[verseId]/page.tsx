import { Page } from "@/components/Page";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { InfoSection } from "@/components/sections/InfoSection";
import { VerseContentSection } from "@/components/sections/VerseContentSection";
import { client } from "@/utils/api";
import { cacheLife } from "next/cache";
import Link from "next/link";

export const dynamicParams = true;

type VersePageProps = {
  params: Promise<{ bibleId: string; verseId: string }>;
};

/**
 * Single verse page. Renders resulting verse content.
 *
 * See our [Verses Guide](https://docs.api.bible/guides/verses) for more.
 */
export default async function VersePage(props: VersePageProps) {
  "use cache";
  cacheLife("max");
  const { bibleId, verseId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const { data: bible } = await client.bibles.get(bibleId);
  //Fetch a single verse from the `/bibles/{bibleId}/verses/{verseId}` endpoint
  const { data: verse } = await client.verses.get(bibleId, verseId, {
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
            title: "Verses",
          },
          {
            title: verse.reference!,
            href: `/bibles/${bibleId}/verses/${verse.id}`,
          },
        ]}
      />

      <InfoSection
        title="Fetching a Single Verse"
        url="https://rest.api.bible/v1/bibles/{bibleId}/verses/{verseId}"
        info={
          <>
            <p className="mb-2">
              To fetch information and content for a single verse, you must send
              a <code className="font-bold">GET</code> request to the above API
              endpoint using the <b>Bible ID</b> and <b>Verse ID</b> you would
              like to fetch. For more information, check out our{" "}
              <Link
                href="https://docs.api.bible/guides/verses"
                className="underline"
              >
                Verses Guide.
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
        linkBase={`/bibles/${bibleId}/verses`}
        verseContent={verse}
        title={verse.id}
      />
    </Page>
  );
}
