import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    text: z.string(),
    img: z.string(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    img: z.string().optional(),
    url: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
