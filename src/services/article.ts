// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { Pokemon } from "./types";

const articleApiKey = import.meta.env.VITE_AISUMMARIZE_API_KEY;
const articleApiHost = import.meta.env.VITE_AISUMMARIZE_API_HOST;

// Define a service using a base URL and expected endpoints
export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", articleApiKey);
      headers.set("X-RapidAPI-Host", articleApiHost);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query<{ summary: string }, { articleUrl: string }>({
      // encodeURIComponent() function encodes special characters that may be present in the parameter values
      // If we do not properly encode these characters, they can be misinterpreted by the server and cause errors or unexpected behavior. Thus that RTK bug
      query: (params) =>
        `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyGetSummaryQuery } = articleApi;
