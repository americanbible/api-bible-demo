import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type LinkButtonProps = {
  title: string;
  href: string;
  external?: boolean;
  children?: ReactNode;
  className?: string;
};

/**
 * Renders a link as a button
 */
export const LinkButton = ({
  title,
  href,
  external,
  children,
  className,
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`h-full flex gap-2 items-center justify-center px-4 py-2 bg-zinc-100 hover:bg-zinc-300 border-black ${className ?? ""}`}
    >
      {children}
      <span className="text-md text-nowrap">{title}</span>
      {external && <SquareArrowOutUpRight size={12} />}
    </Link>
  );
};
