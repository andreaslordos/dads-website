// sanity.js
import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'ynmpcv7c',
  dataset: 'production',
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-08-24', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
})