import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Imię i nazwisko',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Zdjęcie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'role',
      title: 'Rola / stanowisko',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'language',
      title: 'Język',
      type: 'string',
      options: {
        list: [
          { title: 'Polski', value: 'pl' },
          { title: 'English', value: 'en' },
        ],
      },
    }),
  ],
  preview: { select: { title: 'name', media: 'avatar' } },
});
