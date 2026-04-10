import { demoBibles } from "@/utils/demoBibles";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type BibleLayoutProps = {
  params: Promise<{ bibleId: string }>;
  children: ReactNode;
};

/**
 * Simple layout guard to protect against unauthorized Bible access
 * @param props
 * @returns
 */
export default async function BibleLayout({
  params,
  children,
}: BibleLayoutProps) {
  const { bibleId } = await params;

  if (!demoBibles.includes(bibleId)) {
    notFound();
  }

  return <>{children}</>;
}
