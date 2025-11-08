# Personal Website

This is a personal portfolio website built with Next.js and Sanity CMS.

## Tech Stack

- **Next.js 14** - React framework with ISR (Incremental Static Regeneration)
- **Sanity.io** - Headless CMS for content management
- **Theme UI** - Styling framework
- **Vercel** - Hosting and deployment

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production.\
Creates an optimized production build with static HTML pages.

### `npm start`

Starts the production server after building.

## Deployment

This site is deployed on Vercel with automatic deployments on every push.

### Environment Variables

Required environment variables for deployment:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name
- `SANITY_API_VERSION` - Sanity API version
- `REVALIDATE_SECRET` - Secret for webhook revalidation

## Content Management

Content is managed through Sanity Studio. When content is published, Sanity webhooks trigger on-demand revalidation of the affected pages.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Theme UI Documentation](https://theme-ui.com/)
