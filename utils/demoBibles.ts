/**
 * List of Bibles this demo app will have access to, which
 * has been minimized to reduce the number of API calls made by this app.
 *
 * `hasSections` marks the Bibles that include section headings in every book.
 * Pages only link to sections for these Bibles, since the sections endpoints
 * return a 404 for books without them.
 */
export const demoBibles: { id: string; hasSections: boolean }[] = [
  { id: "de4e12af7f28f599-01", hasSections: false },
  { id: "179568874c45066f-01", hasSections: false },
  { id: "9879dbb7cfe39e4d-01", hasSections: false },
  { id: "685d1470fe4d5c3b-01", hasSections: false },
  { id: "bba9f40183526463-01", hasSections: true },
  { id: "55212e3cf5d04d49-01", hasSections: false },
  { id: "01b29f4b342acc35-01", hasSections: false },
  { id: "f72b840c855f362c-04", hasSections: false },
  { id: "65eec8e0b60e656b-01", hasSections: false },
  { id: "c315fa9f71d4af3a-01", hasSections: false },
  { id: "40072c4a5aba4022-01", hasSections: false },
];

/**
 * Whether the given demo Bible includes section headings
 */
export const hasSections = (bibleId: string) =>
  demoBibles.some((bible) => bible.id === bibleId && bible.hasSections);
