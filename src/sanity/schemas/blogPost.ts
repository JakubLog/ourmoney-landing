import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (input: string) =>
          input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\u0142/g, 'l')
            .replace(/\u0141/g, 'L')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Język',
      type: 'string',
      options: { list: ['pl', 'en'] },
      initialValue: 'pl',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Zajawka',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'mainImage',
      title: 'Obraz główny',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Podpis' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'category',
      title: 'Kategoria',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'relatedFaq',
      title: 'Powiązane FAQ',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqItem' }] }],
    }),
    defineField({
      name: 'cta',
      title: 'CTA (Call to Action)',
      description: 'Wyróżniony baner — pojawi się w połowie i na końcu artykułu.',
      type: 'object',
      fields: [
        defineField({ name: 'heading', type: 'string', title: 'Nagłówek' }),
        defineField({ name: 'text', type: 'text', rows: 2, title: 'Tekst' }),
        defineField({ name: 'buttonLabel', type: 'string', title: 'Tekst przycisku' }),
        defineField({ name: 'buttonUrl', type: 'url', title: 'URL przycisku' }),
      ],
    }),
    defineField({
      name: 'aiSeo',
      title: 'AI SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'aiSummary',
          title: 'AI Summary (TL;DR)',
          type: 'text',
          rows: 4,
          description: 'Streszczenie artykułu dla AI crawlerów (ChatGPT, Perplexity, Google SGE). Max 300 znaków.',
        }),
        defineField({
          name: 'keyTakeaways',
          title: 'Kluczowe wnioski',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Lista 3–5 kluczowych wniosków z artykułu.',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'SEO Title (max 60 znaków)' }),
        defineField({ name: 'description', type: 'text', rows: 3, title: 'Meta Description (max 155 znaków)' }),
        defineField({ name: 'canonical', type: 'url', title: 'Canonical URL (override)' }),
        defineField({ name: 'ogImage', type: 'image', title: 'OG Image (1200×630px)' }),
        defineField({
          name: 'keywords',
          type: 'array',
          title: 'Keywords',
          of: [{ type: 'string' }],
        }),
        defineField({ name: 'noIndex', type: 'boolean', title: 'Ukryj przed wyszukiwarkami', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'mainImage' },
  },
});
