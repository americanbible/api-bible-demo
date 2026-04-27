import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export type BreadcrumbItem = { title: string; href?: string };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

/**
 * Simple component for rendering breadcrumbs, allowing users to backtrack as they navigate the site
 */
export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="flex items-center flex-wrap gap-1">
      {items.map(({ title, href }, i) => (
        <React.Fragment key={title + i}>
          {!!href ? (
            <Link href={href} className="text-sm hover:underline">
              {title}
            </Link>
          ) : (
            <p className="text-sm">{title}</p>
          )}
          {(i !== items.length - 1 || items.length === 1) && (
            <ChevronRight size={12} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
