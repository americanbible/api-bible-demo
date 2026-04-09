/**
 * Simplified API client for demo purposes. Never use your API key in a client-facing
 * application (e.g. React).
 */

/**
 * Request config for a call to API.Bible
 */
export type ApiRequestConfig = {
  /**
   * The API endpoint, i.e. `/bibles`. Does not need `/v1` prefixed.
   */
  endpoint: string;

  /**
   * Query parameters to include in this request
   */
  params?: Record<string, string>;

  /**
   * Key used to unwrap results, defaults to `data`
   */
  dataKey?: string;
};

/**
 * Makes a request to API.Bible using the given config
 * @param config API Request Config. Visit https://docs.api.bible for more information on each endpoint.
 * @returns The result of the query, uses a generic TResult type to cast result type properly.
 */
export async function makeApiRequest<TResult>({
  endpoint,
  params,
  dataKey = "data",
}: ApiRequestConfig): Promise<TResult> {
  //Removes leading slash and/or API version since neither are required.
  let path = endpoint.split("/");
  if (path[0] === "") {
    path = path.slice(1);
  }
  if (path[0] === "v1") {
    path = path.slice(1);
  }

  //Load API key from env vars
  const apiKey = process.env.API_BIBLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key");
  }

  //Build query params string
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  //Build request URL
  const url = `https://rest.api.bible/v1/${path.join("/")}${queryString}`;

  const response = await fetch(url, { headers: { "api-key": apiKey } });

  //Check response status
  if (!response.ok) {
    console.error(response);
    throw new Error("API request failed with status: " + response.status);
  }

  //Parse response data
  const result = await response.json();
  return result[dataKey] as TResult;
}
