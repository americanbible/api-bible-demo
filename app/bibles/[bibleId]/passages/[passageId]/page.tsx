import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { Bible, Passage } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { notFound } from "next/navigation";

type PassagePageProps = {
  params: Promise<{ bibleId: string; passageId: string }>;
};

export default async function PassagePage(props: PassagePageProps) {
  const { bibleId, passageId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });
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
            title: "Passages",
            href: `/bibles/${bibleId}/passages`,
          },
          {
            title: passage.reference,
            href: `/bibles/${bibleId}/passages/${passage.id}`,
          },
        ]}
      />

      <Title page="Passage" title={`${passage.reference} (${passage.id})`} />
      <div
        className="scripture-styles"
        dangerouslySetInnerHTML={{ __html: passage.content }}
      />
    </div>
  );
}
