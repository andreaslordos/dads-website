import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'press',
  title: 'Press',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "e.g. WORMS, BART / MARGE, Star City",
      validation: Rule => Rule.required()
    }),
    defineField({
        name: 'body',
        title: 'Body',
        type: 'blockContent',
        description: 'Add the different names of publications and the link here. E.g. "BBC, MIT News", line seperated, with each publication name hyperlinking to the relevant news article.',
        validation: Rule => Rule.required()
      }),
  ],
})
