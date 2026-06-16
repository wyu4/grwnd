import { Metadata } from "next";

/**
 * Creates the indexing metadata for the page given the tab name
 * @param tabName Optional tab name
 * @returns Metadata object
 */
export const createPageMetadata = (tabName: string | undefined) => {
  return {
    title: `${tabName !== undefined ? tabName + " |" : ""} grwnd`,
    description:
      "A place for developers to post problems worth solving and projects worth knowing about.",
    icons: [
      {
        rel: "icon",
        url: "/grwnd-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "/grwnd-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  } as Metadata;
};
