import { HeaderSection } from "@/components/sections/HeaderSection";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { PassageInput } from "./_components/PassageInput";
import { InfoSection } from "@/components/sections/InfoSection";
import Link from "next/link";
import { Page } from "@/components/Page";

type SectionPageProps = {
  params: Promise<{ bibleId: string }>;
};

/**
 * Passage selection page. Renders two inputs that allow users to select any given passage.
 *
 * See our [Passages Guide](https://docs.api.bible/guides/passages) for more.
 *
 * *Note: There is no corresponding `/passages` endpoint in the API, this is simply a utility page to assist in passage selection.*
 */
export default async function SectionPage(props: SectionPageProps) {
  const { bibleId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
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
            title: "Passages",
            href: `/bibles/${bibleId}/passages`,
          },
        ]}
      />

      <InfoSection
        title="Finding Passages"
        info={
          <>
            <p className="mb-2">
              A passage represents an arbitrary range of verses from the Bible.
              These ranges are not predefined values, but instead depend on the
              given input, known as a <b>Passage ID</b>. A <b>Passsage ID</b>{" "}
              consists of two <b>Verse IDs</b> separated by a{" "}
              <code className="font-bold">{'"-"'}</code>. For more information,
              check out our{" "}
              <Link
                href="https://docs.api.bible/guides/passages"
                className="underline"
              >
                Passages Guide.
              </Link>
            </p>
            <p className="text-sm">
              Tip: If you are having trouble building a specific{" "}
              <b>Passage ID</b>, try{" "}
              <Link
                href="https://docs.api.bible/guides/verses#fetching-a-single-verse"
                className="underline"
              >
                fetching a single verse
              </Link>{" "}
              first to ensure the verses you are looking for exist.
            </p>
          </>
        }
      />
      <PassageInput bibleId={bibleId} />
    </Page>
  );
}
