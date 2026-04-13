import Link from "next/link";
import { ReactNode } from "react";

type LinkButtonProps = {
  title: string;
  href: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Renders a link as a button
 */
export const LinkButton = ({
  title,
  href,
  children,
  className,
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`py-1 px-4 bg-zinc-800 text-white border-zinc-800 border-1 rounded flex gap-1 items-center justify-center hover:bg-zinc-100 hover:text-black ${className ?? ""}`}
    >
      {children}
      <span className="text-md ">{title}</span>
    </Link>
  );
};
