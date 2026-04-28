import { LinkButton } from "@/components/LinkButton";
import { TextSection } from "@/components/sections/TextSection";
import { ArrowRight } from "lucide-react";

/**
 * Generic 404 page
 */
export default async function NotFoundPage() {
  return (
    <div className="w-full min-h-screen flex flex-col ">
      <TextSection>
        <h1 className="font-bold text-4xl">404 | Page Not Found</h1>
        <div>
          <LinkButton
            title="Home Page"
            href="/"
            className="flex-row-reverse w-fit border-[1px]"
          >
            <ArrowRight size={12} className="ml-1" />
          </LinkButton>
        </div>
      </TextSection>
      <div className="bg-black text-white w-full px-4 py-12 flex flex-col items-center gap-2">
        <p className="italic ">
          {'"For the Son of Man came to seek and to save the lost."'}
        </p>
        <p className="text-sm font-bold">Luke 19:10 (NIV)</p>
      </div>
    </div>
  );
}
