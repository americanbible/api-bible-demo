import { Header } from "@/components/Header";
import { InfoCard } from "@/components/InfoCard";
import { Bible, Passage } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

type PassagePageProps = {
  params: Promise<{ bibleId: string; passageId: string }>;
};

/**
 * Single passage page. Renders resulting passage verse content.
 *
 * See our [Passages Guide](https://docs.api.bible/guides/passages) for more.
 */
export default async function PassagePage(props: PassagePageProps) {
  const { bibleId, passageId } = await props.params;

  //Fetch a single bible from the `/bibles/{bibleId}` endpoint
  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
  //Fetch a single passage from the `/bibles/{bibleId}/passages/{passageId}` endpoint
  const passage = await makeCachedApiRequest<Passage>({
    endpoint: `/bibles/${bibleId}/passages/${passageId}`,
    params: {
      "content-type": "html",
      "include-verse-spans": "true",
    },
  });

  if (!passage) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Header
        bible={bible}
        title={passage.reference}
        subtitle={passage.id}
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
            title: "Passages",
            href: `/bibles/${bibleId}/passages`,
          },
          {
            title: passage.reference,
            href: `/bibles/${bibleId}/passages/${passage.id}`,
          },
        ]}
      />
      <InfoCard
        title="Fetching a Passage"
        url="https://rest.api.bible/v1/bibles/{bibleId}/passages/{passageId}"
        info={
          <>
            <p className="mb-2">
              To fetch a passage in Bible, you must send a GET request to the
              above API endpoint using the appropriate <b>Bible ID</b> and
              <b>Passage ID</b> you would like to fetch. For more information,
              check out our{" "}
              <Link
                href="https://docs.api.bible/guides/passages"
                className="underline"
              >
                Passages Guide.
              </Link>{" "}
              While a <b>Passage ID</b> can span both chapters and books, the
              API will only return the <i>first 200 verses of the result</i>. In
              this instance, the truncated result will be reflectd in the{" "}
              <code className="font-bold">id</code> field, which will show the
              verse range actually returned. This means that large passages may
              need to be broken up into smaller chunks to successfully fetch
              them in their entirety from the API.
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
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[60vw]">
          <div
            className="scripture-styles"
            dangerouslySetInnerHTML={{ __html: passage.content }}
          />
        </div>
      </div>
    </div>
  );
}
