import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "e.g. Winner, Index Award, 2019",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'awardingbody',
      title: 'Awarding body',
      type: 'string',
      description: "e.g. NASA",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'prizefor',
      title: 'Prize for:',
      type: 'string',
      description: "e.g. 'Star City', 'WORMS'",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'optional',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'index',
      title: 'Index',
      description: 'Four digit number, starting from 0000 (first) and ending with 9999 (last)',
      type: 'string',
      validation: Rule => Rule.required().min(4).max(4)
    }),
    defineField({
      name: 'link',
      title: 'Link',
      description: 'Optional',
      type: 'url',
    }),
  ],
})
