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
      options: { source: 'title' },
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
      type: 'string',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'SEO Title (max 60 znaków)' }),
        defineField({ name: 'description', type: 'text', rows: 3, title: 'Meta Description (max 155 znaków)' }),
        defineField({ name: 'ogImage', type: 'image', title: 'OG Image (1200×630px)' }),
        defineField({ name: 'noIndex', type: 'boolean', title: 'Ukryj przed wyszukiwarkami', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'mainImage' },
  },
});
