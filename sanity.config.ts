import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { blogPost } from './src/sanity/schemas/blogPost';
import { faqItem } from './src/sanity/schemas/faqItem';

export default defineConfig({
  name: 'ourmoney-landing',
  title: 'OurMoney Landing',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [blogPost, faqItem],
  },
});
