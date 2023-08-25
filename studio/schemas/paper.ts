import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'paper',
  title: 'Paper',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      description: 'In order listed, comma seperated, [first initial]. [last name]',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
        name: 'event',
        title: 'Event / Conference / Journal and year. Optional',
        description: 'e.g., IEEE (2018)',
        type: 'string',
      }),
    defineField({
        name: 'link',
        title: 'Link',
        description: 'Optional',
        type: 'url',
      }),
    defineField({
        name: 'index',
        title: 'Index',
        description: 'Four digit number, starting from 0000 (first) and ending with 9999 (last)',
        type: 'string',
        validation: Rule => Rule.required().min(4).max(4)
      }),
  ],
})
