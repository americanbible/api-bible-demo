import { LinkButton } from "@/components/LinkButton";
import { ArrowRight } from "lucide-react";

/**
 * Generic 404 page
 */
export default async function NotFoundPage() {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <h1 className="font-bold text-4xl">404 | Page Not Found</h1>
      <LinkButton title="Home Page" href="/" className="flex-row-reverse">
        <ArrowRight size={12} className="ml-1" />
      </LinkButton>
      <div className="bg-zinc-100 border-zinc-500 border-1 rounded-md w-fit p-4 px-12 flex flex-col items-center gap-2 mt-8">
        <p className="italic">
          {'"For the Son of Man came to seek and to save the lost."'}
        </p>
        <p className="text-sm font-bold">Luke 19:10 (NIV)</p>
      </div>
    </div>
  );
}
