import { cacheLife } from "next/cache";
import { ApiRequestConfig, makeApiRequest } from "./api";

/**
 * Makes a cached request to API.Bible using the given config to reduce the number of duplicate queries.
 * @param config API Request Config. Visit https://docs.api.bible for more information on each endpoint.
 * @returns The result of the query, uses a generic TResult type to cast result type properly.
 */
export async function makeCachedApiRequest<TResult>(
  config: ApiRequestConfig,
): Promise<TResult> {
  "use cache";
  cacheLife("max");
  return makeApiRequest(config);
}
