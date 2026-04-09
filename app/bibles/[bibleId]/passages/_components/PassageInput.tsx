"use client";

import { LinkButton } from "@/components/LinkButton";
import Link from "next/link";
import { useState } from "react";

type PassageInputProps = {
  bibleId: string;
};

export const PassageInput = ({ bibleId }: PassageInputProps) => {
  const [startVerseId, setStartVerseId] = useState<string>("");
  const [endVerseId, setEndVerseId] = useState<string>("");

  const inputClassName =
    "w-[300px] border-zinc-500 border-2 px-4 py-2 rounded-sm";

  return (
    <div className="flex flex-col gap-4 pt-2 border-t-zinc-200 border-t-1">
      <p className="text-sm">
        Enter two verse IDs below to find a passage. If you are having trouble
        finding verse IDs, see our{" "}
        <Link className="underline" href="https://docs.api.bible/guides/verses">
          verses guide.
        </Link>
      </p>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold">StartIng Verse ID:</h5>
          <input
            className={inputClassName}
            value={startVerseId}
            placeholder="GEN.1.1"
            onChange={(e) => setStartVerseId(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
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
          />
        </div>
      )}
    </div>
  );
};
