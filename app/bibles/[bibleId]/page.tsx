import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";

type BiblePageProps = {
  params: Promise<{ bibleId: string }>;
};

export default async function BiblePage(props: BiblePageProps) {
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
        ]}
      />
    </div>
  );
}
