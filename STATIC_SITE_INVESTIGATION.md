# Static Site Generation Investigation for Sanity CMS Website

## Current Architecture Analysis

### Technology Stack
- **Frontend**: React 18.2.0 (Create React App)
- **CMS**: Sanity.io (v6.4.9)
- **Routing**: React Router v6
- **Hosting**: Firebase Hosting
- **Data Fetching**: Client-side with `@sanity/client`

### Current Flow
1. User visits page → Firebase serves SPA shell
2. React app loads → Client-side routing
3. Each page component fetches data from Sanity via API in `useEffect`
4. Data is fetched from Sanity CDN (enabled)
5. Component renders with fetched data

### Performance Implications
- **Time to First Contentful Paint (FCP)**: Delayed by API calls
- **SEO**: Limited - requires client-side rendering
- **CDN Caching**: Sanity CDN helps, but still requires API calls
- **Loading States**: Every page shows loading spinner initially

---

## Static Site Generation Options

### Option 1: Next.js with ISR (Incremental Static Regeneration) ⭐ RECOMMENDED

**What it provides:**
- Pre-rendered HTML at build time
- On-demand or time-based revalidation
- Excellent Sanity integration
- Webhook support for content updates

**Migration Effort:** Medium
**Performance Gain:** High
**Flexibility:** High

#### Implementation Approach:

1. **Setup**
   ```bash
   npx create-next-app@latest --use-npm
   ```

2. **Key Changes Required:**
   - Convert React Router routes to Next.js pages/app directory
   - Replace `useEffect` data fetching with `getStaticProps` or `getStaticPaths`
   - Update styling (Theme UI → CSS Modules or Tailwind)
   - Configure `next.config.js` for image optimization

3. **Data Fetching Pattern:**
   ```javascript
   // pages/space.js
   export async function getStaticProps() {
     const data = await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc)`);
     return {
       props: { data },
       revalidate: 3600 // Revalidate every hour
     };
   }
   ```

4. **Dynamic Routes (e.g., /content/:slug):**
   ```javascript
   // pages/content/[slug].js
   export async function getStaticPaths() {
     const slugs = await sanityClient.fetch(`*[_type in ["post", "postEarth"]].slug.current`);
     return {
       paths: slugs.map(slug => ({ params: { slug } })),
       fallback: 'blocking' // Generate on-demand for new content
     };
   }
   ```

5. **Webhook Integration:**
   - Set up Sanity webhook to call Next.js revalidation API
   - Create API route: `/api/revalidate`
   - Trigger revalidation when content is published in Sanity

   ```javascript
   // pages/api/revalidate.js
   export default async function handler(req, res) {
     // Validate webhook secret
     if (req.query.secret !== process.env.REVALIDATE_SECRET) {
       return res.status(401).json({ message: 'Invalid token' });
     }

     try {
       // Revalidate specific paths or entire site
       await res.revalidate('/space');
       return res.json({ revalidated: true });
     } catch (err) {
       return res.status(500).send('Error revalidating');
     }
   }
   ```

**Pros:**
- Best performance (static HTML + hydration)
- Great DX and community support
- Built-in image optimization
- Easy webhook integration
- Can mix static and dynamic rendering
- Vercel deployment is seamless

**Cons:**
- Requires rewriting routing logic
- Theme UI migration needed
- Learning curve for Next.js patterns
- Build times increase with more pages

**Estimated Timeline:** 2-3 days for initial migration + testing

---

### Option 2: Gatsby with gatsby-source-sanity

**What it provides:**
- Pure static site generation
- GraphQL layer over Sanity data
- Rich plugin ecosystem

**Migration Effort:** Medium-High
**Performance Gain:** High
**Flexibility:** Medium

#### Implementation Approach:

1. **Setup:**
   ```bash
   npm install -g gatsby-cli
   gatsby new my-site
   npm install gatsby-source-sanity
   ```

2. **Configuration:**
   ```javascript
   // gatsby-config.js
   module.exports = {
     plugins: [
       {
         resolve: 'gatsby-source-sanity',
         options: {
           projectId: 'ynmpcv7c',
           dataset: 'production',
           watchMode: true, // Enables hot-reloading in development
         },
       },
     ],
   };
   ```

3. **Data Fetching:**
   - Use GraphQL instead of Sanity queries
   - Create pages programmatically in `gatsby-node.js`

**Pros:**
- Excellent static site generation
- GraphQL provides type safety
- Good image optimization
- Strong plugin ecosystem

**Cons:**
- Declining community momentum (Next.js has overtaken it)
- Longer build times
- Need to learn GraphQL
- Full rebuild required for content changes (can use Gatsby Cloud for incremental builds)
- More complex than needed for this use case

**Estimated Timeline:** 3-4 days

---

### Option 3: Astro with React Islands

**What it provides:**
- "Islands architecture" - minimal JavaScript
- Can use React components selectively
- Extremely fast static sites

**Migration Effort:** Medium
**Performance Gain:** Very High
**Flexibility:** Medium

#### Implementation Approach:

1. **Setup:**
   ```bash
   npm create astro@latest
   npx astro add react
   ```

2. **File Structure:**
   - Convert pages to `.astro` files
   - Keep React components for interactive parts
   - Fetch data at build time in frontmatter

3. **Example:**
   ```astro
   ---
   // src/pages/space.astro
   import { sanityClient } from '../client';
   const posts = await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc)`);
   ---
   <html>
     <body>
       <h1>Space</h1>
       {posts.map(post => (
         <WorkPreview title={post.title} image={post.mainImage} />
       ))}
     </body>
   </html>
   ```

**Pros:**
- Fastest possible static sites
- Minimal JavaScript shipped to client
- Modern DX
- Can reuse React components

**Cons:**
- Need to learn Astro syntax
- Smaller community than Next.js
- May need to convert components to .astro for best performance
- Webhook/rebuild integration requires CI/CD setup

**Estimated Timeline:** 2-3 days

---

### Option 4: Vite + React Static Plugin (Minimal Migration)

**What it provides:**
- Keep React/React Router
- Add build-time rendering
- Minimal code changes

**Migration Effort:** Low
**Performance Gain:** Medium
**Flexibility:** Medium

#### Implementation Approach:

1. **Setup:**
   ```bash
   npm install vite @vitejs/plugin-react vite-plugin-ssr
   ```

2. **Changes:**
   - Replace CRA with Vite
   - Add SSR/SSG plugin
   - Modify data fetching to work at build time

**Pros:**
- Least migration effort
- Keep existing React components
- Faster than CRA

**Cons:**
- Less mature static generation story
- Manual webhook/rebuild setup needed
- Smaller community for this specific use case

**Estimated Timeline:** 1-2 days

---

## Webhook + Build Pipeline Strategy

For **infrequent updates** (once per week), you have two main strategies:

### Strategy A: On-Demand Revalidation (Next.js ISR)
1. Content editor publishes in Sanity
2. Sanity webhook triggers Next.js API route
3. Next.js revalidates affected pages in seconds
4. No full rebuild needed

**Best for:** Sites with occasional updates, want instant updates

### Strategy B: Full Rebuild on Content Change
1. Content editor publishes in Sanity
2. Sanity webhook triggers CI/CD pipeline (GitHub Actions, Vercel, Netlify)
3. Full site rebuild (2-5 minutes typically)
4. Deploy new static files

**Best for:** Complete cache invalidation, simpler setup

### Recommended Pipeline for Your Use Case:

```yaml
# .github/workflows/deploy.yml
name: Deploy on Sanity Update

on:
  repository_dispatch:
    types: [sanity-update]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: firebase deploy --only hosting
```

**Sanity Webhook Setup:**
1. Go to Sanity Studio → API → Webhooks
2. Add webhook URL: `https://api.github.com/repos/<user>/<repo>/dispatches`
3. Event type: `sanity-update`
4. Trigger on: Document changes

---

## Comparison Matrix

| Feature | Next.js ISR | Gatsby | Astro | Vite Static |
|---------|------------|--------|-------|-------------|
| Migration Effort | Medium | Medium-High | Medium | Low |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| SEO | Excellent | Excellent | Excellent | Good |
| Build Time | Fast | Slow | Fast | Fast |
| Community | Very Large | Medium | Growing | Medium |
| Sanity Integration | Excellent | Good | Manual | Manual |
| Webhook Support | Built-in | Via Cloud | CI/CD | CI/CD |
| Learning Curve | Medium | High | Medium | Low |
| Future-Proof | High | Medium | High | Medium |

---

## Recommended Solution: Next.js with ISR

### Why Next.js?

1. **Best balance** of performance, DX, and community support
2. **ISR** perfect for "infrequent updates" use case
3. **Built-in API routes** for webhook handling
4. **Image optimization** out of the box
5. **Vercel deployment** is one-click (or keep Firebase)
6. **Sanity** has official Next.js examples and guides

### Implementation Phases

#### Phase 1: Setup & Basic Migration (Day 1)
- [ ] Create Next.js project
- [ ] Migrate basic pages (Homepage, static pages)
- [ ] Set up Sanity client
- [ ] Configure Firebase hosting for Next.js (or migrate to Vercel)

#### Phase 2: Dynamic Content (Day 2)
- [ ] Implement dynamic routes with `getStaticPaths`
- [ ] Convert all data fetching to `getStaticProps`
- [ ] Migrate Theme UI styles
- [ ] Test all pages

#### Phase 3: Webhook Integration (Day 3)
- [ ] Create revalidation API route
- [ ] Set up Sanity webhook
- [ ] Test content update flow
- [ ] Deploy and monitor

### Alternative: Stick with Current Setup + Optimization

If migration is not desired right now, you can optimize the current setup:

1. **Enable Service Worker Caching**
   ```bash
   npm install workbox-webpack-plugin
   ```

2. **Implement Client-Side Caching**
   - Use React Query or SWR for data caching
   - Add localStorage caching layer

3. **Optimize Sanity Queries**
   - Add projections to reduce payload size
   - Use Sanity CDN (already enabled)

4. **Add Skeleton Screens**
   - Replace loading spinners with content placeholders

**Performance Gain:** Low-Medium
**Effort:** 4-6 hours

---

## Hosting Considerations

### Firebase Hosting (Current)
- **Static sites:** ✅ Fully supported
- **Next.js:** ⚠️ Requires Cloud Functions for SSR (not needed for SSG)
- **Cost:** Free tier generous

### Vercel (Recommended for Next.js)
- **Next.js:** ✅ Built by same team
- **ISR:** ✅ Native support
- **Webhooks:** ✅ Easy setup
- **Cost:** Free for personal projects

### Netlify
- **Static sites:** ✅ Excellent
- **Next.js:** ✅ Good support
- **Build plugins:** ✅ Rich ecosystem
- **Cost:** Free tier available

---

## Cost Analysis (Monthly)

| Solution | Hosting | Builds | Total |
|----------|---------|--------|-------|
| Current (Firebase + CRA) | Free | N/A | $0 |
| Next.js ISR (Vercel) | Free | Free | $0 |
| Next.js ISR (Firebase) | Free | Free (GitHub Actions) | $0 |
| Gatsby Cloud | Free | $0-29 | $0-29 |

All solutions can run on free tiers for a personal site with weekly updates.

---

## Conclusion & Recommendation

**For your use case (infrequent updates, Sanity CMS), I recommend:**

### 🏆 Next.js with ISR + On-Demand Revalidation

**Why:**
- Instant updates when you publish in Sanity (via webhook)
- Static HTML for great performance and SEO
- No need for full rebuilds
- Keeps your Firebase hosting (or switch to Vercel for easier setup)
- 2-3 day migration effort
- Future-proof technology choice

**Quick Start:**
```bash
npx create-next-app@latest dad-website-nextjs
cd dad-website-nextjs
npm install @sanity/client @sanity/image-url @portabletext/react
```

**Next Steps:**
1. Review this document
2. Decide on migration approach
3. I can help implement the chosen solution
4. Set up webhook integration
5. Test and deploy

---

## Questions to Consider

1. Do you want to maintain Firebase hosting or switch to Vercel?
2. How quickly do updates need to appear after publishing in Sanity?
   - Instant: Use ISR with webhooks
   - Within 5 minutes: Use full rebuild
3. Is the styling framework (Theme UI) important to keep?
4. What's your comfort level with learning Next.js patterns?

Let me know which approach interests you most, and I can provide a detailed migration plan or help implement it!
