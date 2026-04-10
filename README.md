## API.Bible NextJS Demo Application

Welcome to the API.Bible NextJS demo application! This application was built to give you examples of how our API can be used to display Bible content. The URL structure of this application is intended to match that of our API to help you get familiar with how Bible data is queried. Along with the accompanying API results, each page will include a quick guide to querying the data that is being shown. If you want more details about our platform, be sure to check out our [documentation](https://docs.api.bible).

You can view the live demo app [here](https://demo.api.bible).

### Project Overview

#### Tech Stack

This app was built using the following technologies:

- [Next.js (App Router)](https://nextjs.org)
- [Typescript](https://www.typescriptlang.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

#### Making Calls to API.Bible

This app uses the NodeJS `fetch` function to make calls to API.Bible. You can find more information in the [api.ts](./utils/api.ts) file. Detailed guides about each API endpoint can be found in our [documentation](https://docs.api.bible/guides/bibles) or our [API reference](https://api.bible/api-reference).

Since this app is using NextJS, all API calls are made on the server-side. This protects its API key and allows the opportunity to cache those requests. For your own application, it is recommended to use a similar pattern, as using your API key in a client-side application (html/javascript, basic React, etc.) will expose your API key.

Caching requests also allows this app to throttle the number of API calls it makes in a given month. A full standard Bible has over 31,000 verses, so minimizing duplicate API calls is extremely important (especially during active development).

#### Structure

As mentioned earlier, the structure of this app is designed to mimic the API. Where an API endpoint exists, a page exists with details on the endpoint and the result of the API call. If you want more details on a specific page, you can search the [app](./app/) directory. We will also provide a quick guide below:

| API Endpoint                                      | Corresponding File                                                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/bibles`                                         | [app/page.tsx](./app/page.tsx)                                                                                               |
| `/bibles/{bibleId}`                               | [app/bibles/[bibleId]/page.tsx](./app/bibles/[bibleId]/page.tsx)                                                             |
| `/bibles/{bibleId}/books`                         | [app/bibles/[bibleId]/books/page.tsx](./app/bibles/[bibleId]/books/page.tsx)                                                 |
| `/bibles/{bibleId}/books/{bookId}`                | [app/bibles/[bibleId]/books/[bookId]/page.tsx](./app/bibles/[bibleId]/books/[bookId]/page.tsx)                               |
| `/bibles/{bibleId}/books/{bookId}/chapters`       | [app/bibles/[bibleId]/books/[bookId]/chapters/page.tsx](./app/bibles/[bibleId]/books/[bookId]/chapters/page.tsx)             |
| `/bibles/{bibleId}/books/{bookId}/sections`       | [app/bibles/[bibleId]/books/[bookId]/sectionspage.tsx](./app/bibles/[bibleId]/books/[bookId]/sections/page.tsx)              |
| `/bibles/{bibleId}/chapters/{chapterId}`          | [app/bibles/[bibleId]/chapters/[chapterId]/page.tsx](./app/bibles/[bibleId]/chapters/[chapterId]/page.tsx)                   |
| `/bibles/{bibleId}/chapters/{chapterId}/sections` | [app/bibles/[bibleId]/chapters/[chapterId]/sections/page.tsx](./app/bibles/[bibleId]/chapters/[chapterId]/sections/page.tsx) |
| `/bibles/{bibleId}/chapters/{chapterId}/sections` | [app/bibles/[bibleId]/chapters/[chapterId]/verses/page.tsx](./app/bibles/[bibleId]/chapters/[chapterId]/verses/page.tsx)     |
| `/bibles/{bibleId}/passages/{passageId}`          | [app/bibles/[bibleId]/passages/[bookId]/page.tsx](./app/bibles/[bibleId]/passages/[bookId]/page.tsx)                         |
| `/bibles/{bibleId}/search`                        | [app/bibles/[bibleId]/search/page.tsx](./app/bibles/{bibleId}/search/page.tsx)                                               |
| `/bibles/{bibleId}/sections/{sectionId}`          | [app/bibles/[bibleId]/sections/[sectionId]/page.tsx](./app/bibles/{bibleId}/sections/{sectionId}/page.tsx)                   |
| `/bibles/{bibleId}/verses/{verseId}`              | [app/bibles/[bibleId]/verses/[verseId]/page.tsx](./app/bibles/[bibleId]/verses/[verseId]/page.tsx)                           |

### Local Setup

This application has been configured to minimize local setup time. To get this application running locally, follow the steps below:

1. First, you will need to copy the [example .env](./.env.example) file into a new `.env` file.

2. Replace the `API_BIBLE_API_KEY` environment variable with your API.Bible API key. See the [authentication](https://docs.api.bible/quick-start/authentication) quick start guide for information on how to retrieve your API key.

3. Run the following:

```sh
npm run dev
```

4. Your application should now be running on `localhost:3000`

5. (optional) For demo purposes, the list of Bibles shown in the live demo app has been limited to the ones listed in [demoBibles.ts](./utils/demoBibles.ts). If you want to see the full list of Bibles you have access to, feel free to remove that list and its dependency in the [BibleLayout](./app/bibles/[bibleId]/layout.tsx).
