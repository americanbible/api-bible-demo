"use client";

import { LinkButton } from "@/components/LinkButton";
import Link from "next/link";
import { useState } from "react";

type PassageInputProps = {
  bibleId: string;
};

/**
 * Renders a pair of inputs that allows the user to select their own passage
 */
export const PassageInput = ({ bibleId }: PassageInputProps) => {
  const [startVerseId, setStartVerseId] = useState<string>("");
  const [endVerseId, setEndVerseId] = useState<string>("");

  const inputClassName = "w-[300px]  border-1 px-4 py-2";

  return (
    <div className="flex flex-col gap-4 p-12 border-t-zinc-200 border-b-1">
      <p>
        Enter two verse IDs below to find a passage. If you are having trouble
        finding verse IDs, check out our{" "}
        <Link className="underline" href="https://docs.api.bible/guides/verses">
          Verses Guide.
        </Link>
      </p>

      <div className="flex flex-row gap-4">
        <div className="grow flex flex-col gap-1">
          <h5 className="text-sm font-bold">StartIng Verse ID:</h5>
          <input
            className={inputClassName}
            value={startVerseId}
            placeholder="GEN.1.1"
            onChange={(e) => setStartVerseId(e.target.value)}
          />
        </div>

        <div className="grow flex flex-col gap-1">
          <h5 className="text-sm font-bold">Ending Verse ID:</h5>
          <input
            className={inputClassName}
            value={endVerseId}
            placeholder="GEN.1.3"
            onChange={(e) => setEndVerseId(e.target.value)}
          />
        </div>
      </div>

      {!!startVerseId && !!endVerseId && (
        <div className="w-fit">
          <LinkButton
            href={`/bibles/${bibleId}/passages/${startVerseId}-${endVerseId}`}
            title="Go to Passage"
            className="border-1"
          />
        </div>
      )}
    </div>
  );
};
