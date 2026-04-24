import { BreadcrumbItem, Breadcrumbs } from "../Breadcrumbs";
import { Spacer } from "../Spacer";

type HeaderProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

/**
 * Renders a head consisting of the following:
 *   - Information about the currently selected Bible (name, ID, etc.)
 *   - Breadcrumbs
 *   - A page title & subtitle (if provided)
 */
export const HeaderSection = ({ title, breadcrumbs }: HeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-stretch border-black border-b-[1px]">
        <Spacer />
        <div className="flex flex-col px-4 py-2 grow">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex gap-2 items-center">
            <h1 className="font-bold text-3xl">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
