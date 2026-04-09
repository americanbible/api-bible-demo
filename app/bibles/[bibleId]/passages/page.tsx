import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { PassageInput } from "./_components/PassageInput";

type SectionPageProps = {
  params: Promise<{ bibleId: string }>;
};

export default async function SectionPage(props: SectionPageProps) {
  const { bibleId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
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
            title: "Passages",
            href: `/bibles/${bibleId}/passages`,
          },
        ]}
      />

      <Title page="Find Passages" title={`${bible.name}`} />

      <PassageInput bibleId={bibleId} />
    </div>
  );
}
