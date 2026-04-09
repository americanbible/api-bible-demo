import { BibleInfoHeader } from "@/components/BibleInfoHeader";
import { Title } from "@/components/Title";
import { Bible } from "@/types/api";
import { makeCachedApiRequest } from "@/utils/cache";
import { LinkButton } from "@/components/LinkButton";
import { Search } from "lucide-react";

type SearchPageProps = {
  params: Promise<{ bibleId: string }>;
};

export default async function SearchPage(props: SearchPageProps) {
  const { bibleId } = await props.params;

  const bible = await makeCachedApiRequest<Bible>({
    endpoint: `/bibles/${bibleId}`,
  });

  const values = [
    ["Aaron", "name"],
    ["l?ve", "single-wildcard"],
    ["wo*d", "wildcard"],
    ["John 3:16-19", "verse-range"],
  ];

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
            title: "Search",
            href: `/bibles/${bibleId}/search`,
          },
        ]}
      />
      <Title page="Search" title={`${bible.name}`} />
      <div className="flex flex-col gap-4 pt-2 border-t-zinc-200 border-t-1">
        <p className="text-sm">
          To avoid API abuse, our search demo is currently limited to a
          predefined set of search values. Click one below to get started:
        </p>

        <div className="flex flex-row gap-4">
          {values.map(([value, href]) => (
            <LinkButton
              key={value}
              href={`/bibles/${bibleId}/search/${href}`}
              title={`Search "${value}"`}
            >
              <Search size={16} />
            </LinkButton>
          ))}
        </div>
      </div>
    </div>
  );
}
