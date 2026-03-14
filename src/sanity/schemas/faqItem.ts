import { defineType, defineField } from 'sanity';

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Pytanie',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odpowiedź',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Język',
      type: 'string',
      options: { list: ['pl', 'en'] },
      initialValue: 'pl',
    }),
    defineField({
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [{ title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
