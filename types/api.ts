/**
 * This file is a rough approximation of the data types returned from API.Bible. In some cases,
 * certain fields may not be present depending on the query params used. If using these in your own application,
 * please be sure to check your API output to ensure these types match.
 */

/**
 * Represents a singe "Bible" object returned from the API.
 */
export type Bible = {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
  countries: {
    id: string;
    name: string;
    nameLocal: string;
  }[];
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  relatedDbl: string;
  type: string;
  updatedAt: string;
  audioBibles: {
    id: string;
    name: string;
    nameLocal: string;
    description: string;
    descriptionLocal: string;
  }[];
};

/**
 * Represents a singe "Book" object returned from the API.
 */
export type Book = {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
  chapters: Chapter[];
};

/**
 * Represents a singe "Chapter" object returned from the API.
 */
export type Chapter = {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
};

/**
 * Represents a singe "Chapter" object returned from the API that includes verse content
 */
export type ChapterWithVerseContent = Chapter & VerseContent;

/**
 * Represents a singe "Section" object returned from the API.
 */
export type Section = {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  title: string;
  firstVerseId: string;
  lastVerseId: string;
  firstVerseOrgId: string;
  lastVerseOrgId: string;
};

/**
 * Represents a singe "Section" object returned from the API that includes verse content
 */
export type SectionWithVerseContent = Section & VerseContent;

/**
 * Represents a singe "Passage" object returned from the API.
 */
export type Passage = {
  id: string;
  bibleId: string;
  orgId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
};

/**
 * Represents a singe "Verse" object returned from the API.
 */
export type Verse = {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
};

/**
 * Represents a singe "Verse" object returned from the API that includes verse content
 */
export type VerseWithVerseContent = Verse & VerseContent;

/**
 * Represents the shared fields an object containing verse content will have.
 * The `content` field, while usually a string, can change types based on the `content-type` query param.
 */
export type VerseContent = {
  content: string;
  verseCount: number;
  copyright: string;
  next: {
    id: string;
    bookId: string;
  };
  previous: {
    id: string;
    bookId: string;
  };
};

/**
 * Represents the `meta` data that is returned with each request.
 */
export type RequestMeta = {
  fums: string;
  fumsId: string;
  fumsJsInclude: string;
  fumsJs: string;
  fumsNoScript: string;
};

/**
 * Represents search results returned from the API.
 */
export type SearchResults = {
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  verses: {
    id: string;
    orgId: string;
    bibleId: string;
    bookId: string;
    chapterId: string;
    text: string;
    reference: string;
  }[];
  passages: {
    id: string;
    bibleId: string;
    orgId: string;
    content: string;
    reference: string;
    verseCount: number;
    copyright: string;
  }[];
};
