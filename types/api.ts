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

export type Book = {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
};

export type ChapterWithVerseContent = Chapter & VerseContent;

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

export type SectionWithVerseContent = Section & VerseContent;

export type Passage = {
  id: string;
  bibleId: string;
  orgId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
};

export type Verse = {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
};

export type VerseWithVerseContent = Verse & VerseContent;

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

export type RequestMeta = {
  fums: string;
  fumsId: string;
  fumsJsInclude: string;
  fumsJs: string;
  fumsNoScript: string;
};

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
