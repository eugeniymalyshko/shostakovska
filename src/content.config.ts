import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Short label shown on the homepage card
      category: z.string(),
      // Longer label shown on the project page
      type: z.string(),
      description: z.string(),
      order: z.number(),
      cover: image(),
      coverAlt: z.string(),
      images: z.array(image()).min(1),
    }),
});

export const collections = { projects };
