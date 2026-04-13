import Link from "next/link";

export interface NavItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  isActive?: boolean;
}

/**
 * Renders a nav item with a clickable link. Handles both internal and external links
 */
export const NavItem = ({
  className: incomingClassName = "",
  children,
  href,
  isActive,
  ...props
}: NavItemProps) => {
  const baseClasses =
    "text-zinc-950 text-xl md:text-sm md:opacity-70 hover:opacity-100 group cursor-pointer flex md:inline-flex w-full md:w-auto items-center justify-between text-nowrap";

  const activeClasses = isActive
    ? "font-bold text-primary tracking-tight md:opacity-100 border-b-2 md:border-b-0 border-primary md:pb-0 pb-1"
    : "";

  const className = `${baseClasses} ${activeClasses} ${incomingClassName}`;

  if (/^https?:\/\//.test(href.toString())) {
    return (
      <a
        target="_blank"
        href={href.toString()}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};
