import { createClient, ContentfulClientApi } from "contentful";

export function getContentfulClient(): ContentfulClientApi<undefined> {
  const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  // Check for existing client in development to prevent re-creation on hot reload
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((global as any).contentfulClient) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (global as any).contentfulClient;
    }
  }

  if (!space || !accessToken) {
    console.warn("Contentful Space ID or Access Token is missing. Returning mock client.");
    return {
      getEntries: async () => ({ items: [] }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  const client = createClient({
    space,
    accessToken,
  });

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).contentfulClient = client;
  }

  return client;
}
