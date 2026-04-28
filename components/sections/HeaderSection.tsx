import { Bible } from "@/types/api";
import { BreadcrumbItem, Breadcrumbs } from "../Breadcrumbs";
import { Spacer } from "../Spacer";
import { LinkButton, LinkButtonProps } from "../LinkButton";
import { ArrowDownUp } from "lucide-react";

type HeaderProps = {
  bible?: Bible;
  title?: string;
  breadcrumbs: BreadcrumbItem[];
  actionItems?: LinkButtonProps[];
};

/**
 * Renders a head consisting of the following:
 *   - Information about the currently selected Bible (name, ID, etc.)
 *   - Breadcrumbs
 *   - A page title & subtitle (if provided)
 */
export const HeaderSection = ({
  breadcrumbs,
  bible,
  title,
  actionItems = [],
}: HeaderProps) => {
  const items: LinkButtonProps[] = [];
  if (bible) {
    items.push({
      title: "Switch Bibles",
      href: "/bibles",
      children: <ArrowDownUp size={16} />,
    });
  }
  items.push(...actionItems);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-stretch border-black border-b-[1px] sm:pr-4">
        <Spacer />
        <div className="flex flex-col px-4 py-12 grow">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex gap-2 items-center">
            {!!bible && (
              <div className="flex flex-col grow">
                <h3 className="text-2xl font-bold">
                  {bible.name} ({bible.abbreviation})
                </h3>
                <p className="text-zinc-500">{bible.id}</p>
              </div>
            )}
            {!!title && <h3 className="text-2xl font-bold">{title}</h3>}
          </div>
          {!!items.length && (
            <div className="mt-4 flex gap-2 flex-col sm:flex-row sm:items-center  sm:flex-wrap">
              {items.map((item) => (
                <LinkButton
                  key={item.href}
                  {...item}
                  className="border-[1px]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
