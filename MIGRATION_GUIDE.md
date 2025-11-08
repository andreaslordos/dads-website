# Migrating from Client-Side Sanity CMS to Static Site Generation

A comprehensive guide to migrating a React website from client-side Sanity CMS fetching to static site generation using Next.js with Incremental Static Regeneration (ISR).

## Table of Contents

1. [Overview](#overview)
2. [Why Migrate?](#why-migrate)
3. [Prerequisites](#prerequisites)
4. [Architecture Comparison](#architecture-comparison)
5. [Migration Steps](#migration-steps)
6. [Deployment to Vercel](#deployment-to-vercel)
7. [Setting Up Webhooks](#setting-up-webhooks)
8. [Domain Migration](#domain-migration)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers migrating a website from:
- **From:** Create React App with client-side Sanity fetching
- **To:** Next.js with Incremental Static Regeneration (ISR)

**Result:** Pre-rendered static HTML pages that update automatically when content changes in Sanity CMS.

---

## Why Migrate?

### Problems with Client-Side Rendering

**Before (Client-Side Fetching):**
```javascript
// Client-side data fetching (BAD for SEO)
useEffect(() => {
  sanityClient.fetch(query).then(setData);
}, []);
```

**Issues:**
- ❌ Poor SEO - search engines see empty HTML
- ❌ Slow initial page load - users see loading spinners
- ❌ Content not indexed properly by Google
- ❌ Poor user experience on slow connections
- ❌ Increased API calls to Sanity

### Benefits of Static Site Generation

**After (Static Generation):**
```javascript
// Build-time data fetching (GOOD for SEO)
export async function getStaticProps() {
  const data = await sanityClient.fetch(query);
  return { props: { data }, revalidate: 3600 };
}
```

**Benefits:**
- ✅ Excellent SEO - full HTML pre-rendered
- ✅ Fast page loads - no API calls needed
- ✅ Better indexing by search engines
- ✅ Reduced Sanity API usage
- ✅ Content updates via webhooks

---

## Prerequisites

### Required Knowledge
- React basics
- Understanding of your current Sanity schema
- Basic command line usage
- Access to domain DNS settings

### Required Accounts
- GitHub account (for code hosting)
- Vercel account (free tier works)
- Sanity account (existing)
- Domain registrar access

### Tools Needed
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

---

## Architecture Comparison

### Before: Client-Side Architecture

```
User Request → Firebase/Hosting
              ↓
         Empty HTML Shell
              ↓
         React App Loads
              ↓
    useEffect Calls Sanity API
              ↓
         Content Renders
```

**Timeline:** 3-5 seconds to see content

### After: Static Generation Architecture

```
Build Time:
  Next.js → Sanity API → Generate Static HTML

User Request:
  Vercel → Pre-rendered HTML (instant)

Content Update:
  Sanity CMS → Webhook → Vercel → Regenerate Page
```

**Timeline:** <1 second to see content

---

## Migration Steps

### Step 1: Update package.json

Replace Create React App dependencies with Next.js:

```json
{
  "name": "your-website",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@portabletext/react": "^3.0.7",
    "@sanity/client": "^6.4.9",
    "@sanity/image-url": "^1.0.2",
    "@theme-ui/mdx": "^0.16.1",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "theme-ui": "^0.16.1"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

**Run:**
```bash
npm install
```

---

### Step 2: Create Next.js Directory Structure

```bash
# Create required directories
mkdir -p pages/api pages/content lib components
```

**Structure:**
```
your-project/
├── pages/                 # Next.js pages (routes)
│   ├── _app.js           # App wrapper
│   ├── _document.js      # HTML document
│   ├── index.js          # Homepage
│   ├── space.js          # /space route
│   ├── contact.js        # /contact route
│   ├── content/
│   │   └── [slug].js     # Dynamic routes
│   └── api/
│       └── revalidate.js # Webhook endpoint
├── lib/                   # Utilities
│   ├── sanity.js         # Sanity client
│   ├── theme/            # Theme files
│   └── utils/            # Helper functions
├── src/                   # Keep existing components
│   └── components/       # Reusable components
├── public/               # Static assets
│   └── fonts/           # Custom fonts
└── next.config.js        # Next.js config
```

---

### Step 3: Move Sanity Client to lib/

**Create `lib/sanity.js`:**
```javascript
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "your-project-id",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-08-24",
});
```

**Copy utilities:**
```bash
cp -r src/theme lib/
cp -r src/utils lib/
```

---

### Step 4: Create Next.js Configuration

**Create `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
```

---

### Step 5: Create _app.js (Global Layout)

**Create `pages/_app.js`:**
```javascript
/* @jsxImportSource theme-ui */
import { ThemeUIProvider } from "theme-ui";
import { theme } from "../lib/theme/theme";
import Navbar from "../src/components/Navbar";
import "../lib/theme/global.css";

const containerSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  paddingBottom: "5rem",
};

const appSx = {
  width: "67%",
  display: "flex",
  flexDirection: "column",
  marginTop: "0em",
  minHeight: "-webkit-fill-available",

  iframe: {
    aspectRatio: "16/9",
    width: "100%",
  },

  "@media (max-width: 835px)": {
    width: "85%",
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <ThemeUIProvider theme={theme}>
      <div sx={containerSx}>
        <Navbar />
        <div className="mainContent" sx={appSx}>
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeUIProvider>
  );
}

export default MyApp;
```

---

### Step 6: Create _document.js (SEO & Meta Tags)

**Create `pages/_document.js`:**
```javascript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />

        {/* SEO Meta Tags */}
        <meta name="title" property="og:title" content="Your Site Title" />
        <meta
          name="description"
          property="og:description"
          content="Your site description"
        />
        <meta name="url" property="og:url" content="https://yoursite.com/" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Your Site Title" />
        <meta name="twitter:description" content="Your site description" />

        {/* Google Analytics (optional) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'YOUR-GA-ID');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

---

### Step 7: Migrate Pages to Static Generation

#### Before (Client-Side):
```javascript
// src/pages/Homepage.js
import { useEffect, useState } from "react";
import { sanityClient } from "../client";

export default function Homepage() {
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "author"][0]`)
      .then((data) => setItemData(data))
      .catch(console.error);
  }, []);

  if (!itemData) return <Loading />;

  return <div>{/* Render content */}</div>;
}
```

#### After (Static Generation):
```javascript
// pages/index.js
import { sanityClient } from "../lib/sanity";

export default function Homepage({ itemData }) {
  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <div>{/* Render content */}</div>
    </>
  );
}

export async function getStaticProps() {
  const itemData = await sanityClient.fetch(
    `*[_type == "author"] | order(publishedAt desc)[0]`
  );

  return {
    props: {
      itemData,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
```

**Key Changes:**
1. Remove `useState` and `useEffect`
2. Add `getStaticProps` function
3. Accept data as props
4. Set `revalidate` time (in seconds)

---

### Step 8: Migrate Dynamic Routes

#### Before (React Router):
```javascript
// src/pages/ContentItem.js with useParams
import { useParams } from "react-router-dom";

export default function ContentItem() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(`*[slug.current == $slug][0]`, { slug })
      .then(setData);
  }, [slug]);

  return <div>{/* content */}</div>;
}
```

#### After (Next.js Dynamic Routes):
```javascript
// pages/content/[slug].js
import { sanityClient } from "../../lib/sanity";

export default function ContentItem({ itemData }) {
  return (
    <>
      <Head>
        <title>{itemData.title}</title>
      </Head>
      <div>{/* content */}</div>
    </>
  );
}

export async function getStaticPaths() {
  // Get all slugs at build time
  const slugs = await sanityClient.fetch(
    `*[_type in ["post", "article"]].slug.current`
  );

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate new pages on-demand
  };
}

export async function getStaticProps({ params }) {
  const itemData = await sanityClient.fetch(
    `*[slug.current == $slug]{
      title,
      mainImage,
      body
    }[0]`,
    { slug: params.slug }
  );

  if (!itemData) {
    return { notFound: true };
  }

  return {
    props: { itemData },
    revalidate: 3600,
  };
}
```

---

### Step 9: Update Navigation (React Router → Next.js)

#### Before:
```javascript
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
      About
    </Link>
  );
}
```

#### After:
```javascript
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <Link href="/about" className={router.pathname === "/about" ? "active" : ""}>
      About
    </Link>
  );
}
```

---

### Step 10: Setup Global CSS and Fonts

**Copy fonts to public directory:**
```bash
cp -r src/assets/fonts public/
```

**Update font paths in `lib/theme/global.css`:**
```css
/* Change from relative paths */
@font-face {
  font-family: "Your Font";
  src: url(../assets/fonts/font.ttf) format("truetype");
}

/* To absolute paths */
@font-face {
  font-family: "Your Font";
  src: url(/fonts/font.ttf) format("truetype");
}
```

**Import in `pages/_app.js`:**
```javascript
import "../lib/theme/global.css";
```

---

### Step 11: Create Revalidation API Endpoint

**Create `pages/api/revalidate.js`:**
```javascript
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const slug = req.body?.slug;

    // Revalidate all main pages
    await res.revalidate('/');
    await res.revalidate('/about');
    await res.revalidate('/contact');

    // If a specific slug is provided, revalidate that page
    if (slug) {
      await res.revalidate(`/content/${slug}`);
    }

    return res.json({
      revalidated: true,
      time: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

---

### Step 12: Update .gitignore

```gitignore
# dependencies
/node_modules

# Next.js
/.next/
/out/
.vercel

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

### Step 13: Create Environment Variables Example

**Create `.env.local.example`:**
```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2023-08-24

# Revalidation Secret (generate a random string)
REVALIDATE_SECRET=generate-a-random-secret-here
```

---

### Step 14: Test Local Build

```bash
# Install dependencies
npm install

# Try building
npm run build

# Test production build locally
npm start
```

**Note:** Build may fail if it can't reach Sanity API. This is normal in restricted environments - it will work on Vercel.

---

### Step 15: Commit and Push

```bash
git add -A
git commit -m "Migrate to Next.js with ISR for static site generation"
git push origin your-branch
```

---

## Deployment to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

---

### Step 2: Import Project

1. Click **"Add New... → Project"**
2. Find your GitHub repository
3. Click **"Import"**

---

### Step 3: Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js ✅ (auto-detected)
- **Root Directory:** `./` (leave default)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

---

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your-sanity-project-id |
| `NEXT_PUBLIC_SANITY_DATASET` | production |
| `SANITY_API_VERSION` | 2023-08-24 |
| `REVALIDATE_SECRET` | [generate random string] |

**Generate REVALIDATE_SECRET:**
- Option A: https://generate-secret.vercel.app/32
- Option B: `openssl rand -base64 32`
- Option C: Random keyboard mashing (20+ characters)

**Important:** Check all environment boxes (Production, Preview, Development)

---

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `your-project.vercel.app`
4. Test the site!

---

### Step 6: Automatic Deployments

Once connected, Vercel automatically deploys:
- Every push to main branch → Production
- Every push to other branches → Preview deployments
- Pull requests → Preview URLs for testing

---

## Setting Up Webhooks

Webhooks enable automatic page updates when you publish content in Sanity.

### Step 1: Get Deployment URL

From Vercel dashboard:
- Use the **Domains** URL (e.g., `your-project.vercel.app`)
- NOT the deployment URL (changes with each deploy)

---

### Step 2: Configure Sanity Webhook

1. Go to https://www.sanity.io/manage
2. Select your project
3. Click **API → Webhooks**
4. Click **"Create webhook"**

**Settings:**

| Field | Value |
|-------|-------|
| **Name** | Vercel Revalidation |
| **URL** | `https://your-project.vercel.app/api/revalidate?secret=YOUR_SECRET` |
| **Dataset** | production |
| **Trigger on** | ✅ Create, ✅ Update, ✅ Delete |
| **HTTP method** | POST |
| **Include drafts** | ❌ Unchecked |

**Example URL:**
```
https://my-website.vercel.app/api/revalidate?secret=kJ8mN2pQ7xR4vW9zA3bC6dF1gH5jK8lM
```

5. Click **Save**

---

### Step 3: Test Webhook

**Option A: Test from Sanity**
1. Scroll down in webhook settings
2. Click **"Test webhook"**
3. Look for ✅ green checkmark

**Option B: Publish Content**
1. Edit any content in Sanity Studio
2. Click **Publish**
3. Wait 5-10 seconds
4. Refresh your Vercel site - changes should appear!

---

### Webhook Troubleshooting

**If webhook fails:**

1. **Check URL format:**
   - Must start with `https://` (not `http://`)
   - Must include `?secret=` parameter
   - No typos in domain

2. **Verify secret matches:**
   - Sanity webhook secret must match Vercel env variable exactly
   - No extra spaces or characters

3. **Check Vercel logs:**
   - Go to Vercel → your project → **Logs** tab
   - Look for errors from `/api/revalidate`

4. **Redeploy Vercel:**
   - Env variables only apply after redeployment
   - Go to Deployments → ••• → Redeploy

---

## Domain Migration

### Overview

If you have an existing site on another host (e.g., Firebase), you'll want to:
1. Test Vercel on preview URL first
2. Add custom domain to Vercel
3. Update DNS to point to Vercel
4. Update webhook to use custom domain

---

### Step 1: Add Domain to Vercel

1. Go to Vercel → your project → **Settings → Domains**
2. Enter your domain: `yourdomain.com`
3. Click **Add**
4. Also add: `www.yourdomain.com`
5. Vercel will show DNS instructions

---

### Step 2: Configure DNS

Vercel will show records like:

**For apex domain (`yourdomain.com`):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Steps:**
1. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Delete old records pointing to previous host
4. Add new Vercel records
5. Save changes

**DNS propagation:** 5 minutes to 48 hours (usually ~30 minutes)

---

### Step 3: Verify Domain

1. Return to Vercel → Settings → Domains
2. Wait for status to change from "Invalid" to "Valid" ✅
3. Vercel automatically provisions SSL certificate
4. Test: `https://yourdomain.com`

---

### Step 4: Update Sanity Webhook

Once domain is working:

1. Go to Sanity → API → Webhooks
2. Edit your webhook
3. Change URL from:
   ```
   https://your-project.vercel.app/api/revalidate?secret=...
   ```
   To:
   ```
   https://yourdomain.com/api/revalidate?secret=...
   ```
4. Save and test

---

### Step 5: Decommission Old Host

**If migrating from Firebase:**

1. Keep both running for 1-2 weeks
2. Monitor Vercel for issues
3. When confident, disable Firebase hosting:
   - Firebase Console → Hosting → Can delete deployment or leave as backup

---

## Troubleshooting

### Build Fails on Vercel

**Error: "Cannot fetch from Sanity"**
- Check environment variables are set
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Ensure dataset name is correct

**Error: "Module not found"**
- Check all imports use correct paths
- Verify dependencies in package.json
- Try `npm install` locally first

---

### CSS Looks Different

**Fonts not loading:**
- Ensure fonts are in `public/fonts/`
- Update CSS to use absolute paths: `url(/fonts/font.ttf)`
- Check font files are committed to Git

**Missing styles:**
- Verify `global.css` is imported in `_app.js`
- Check viewport meta tag in `_document.js`
- Ensure all CSS files are copied to `lib/theme/`

---

### Webhook Not Working

**401 Unauthorized:**
- Secret in webhook URL doesn't match env variable
- Make sure to redeploy after adding env variables

**500 Internal Server Error:**
- Check Vercel logs for specific error
- Verify `/api/revalidate.js` file exists
- Test endpoint manually: `curl https://yoursite.com/api/revalidate?secret=YOUR_SECRET`

**Content not updating:**
- Webhook might be working but revalidate failing
- Check which pages are being revalidated in API code
- Try triggering manual revalidation

---

### Images Not Loading

**Sanity images 403 error:**
- Add Sanity domain to `next.config.js`:
  ```javascript
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  }
  ```

**Wrong image paths:**
- Use Next.js `<Image>` component for optimization
- Or keep `<img>` with `urlFor()` helper from Sanity

---

## Performance Optimization

### Lighthouse Score Improvements

**Before (Client-Side Rendering):**
- Performance: 40-60
- SEO: 70-80
- Best Practices: 70-80

**After (Static Generation):**
- Performance: 90-100 ✅
- SEO: 95-100 ✅
- Best Practices: 90-100 ✅

---

### Additional Optimizations

1. **Use Next.js Image component:**
   ```javascript
   import Image from 'next/image';

   <Image
     src={urlFor(image).url()}
     width={800}
     height={600}
     alt="Description"
   />
   ```

2. **Add sitemap generation:**
   - Install: `npm install next-sitemap`
   - Configure sitemap for better SEO

3. **Implement prefetching:**
   - Next.js automatically prefetches `<Link>` components
   - Pages load instantly on navigation

4. **Monitor Core Web Vitals:**
   - Check Vercel Analytics
   - Monitor LCP, FID, CLS metrics

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current site
- [ ] Document current Sanity schema
- [ ] List all routes and pages
- [ ] Note custom functionality
- [ ] Test current site thoroughly

### Migration
- [ ] Update package.json
- [ ] Create Next.js directory structure
- [ ] Move Sanity client to lib/
- [ ] Create next.config.js
- [ ] Create _app.js and _document.js
- [ ] Migrate all pages to getStaticProps
- [ ] Update dynamic routes with getStaticPaths
- [ ] Update navigation (Router → Link)
- [ ] Copy fonts to public/
- [ ] Update CSS font paths
- [ ] Create revalidation API endpoint
- [ ] Update .gitignore
- [ ] Test local build
- [ ] Commit and push

### Deployment
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Add environment variables
- [ ] Deploy to Vercel
- [ ] Test preview URL
- [ ] Verify all pages work
- [ ] Test forms and functionality

### Webhooks
- [ ] Generate REVALIDATE_SECRET
- [ ] Add to Vercel env vars
- [ ] Redeploy Vercel
- [ ] Configure Sanity webhook
- [ ] Test webhook
- [ ] Publish test content
- [ ] Verify auto-updates work

### Domain Migration (if applicable)
- [ ] Test thoroughly on Vercel preview URL
- [ ] Add custom domain to Vercel
- [ ] Update DNS records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate
- [ ] Test custom domain
- [ ] Update Sanity webhook URL
- [ ] Monitor old host traffic
- [ ] Decommission old host when ready

### Post-Migration
- [ ] Monitor Vercel analytics
- [ ] Check error logs
- [ ] Test all functionality
- [ ] Verify SEO improvements (Google Search Console)
- [ ] Update documentation
- [ ] Train content editors on new workflow

---

## Key Takeaways

### What Changed
- **Rendering:** Client-side → Static generation
- **Routing:** React Router → Next.js file-based
- **Data Fetching:** `useEffect` → `getStaticProps`
- **Hosting:** Firebase/other → Vercel
- **Updates:** Manual redeploy → Automatic via webhooks

### Performance Gains
- **Initial Load:** 3-5 seconds → <1 second
- **SEO Score:** 70-80 → 95-100
- **Lighthouse Performance:** 40-60 → 90-100
- **Time to Interactive:** Much faster
- **Sanity API Calls:** Every page load → Only on build/revalidate

### Content Workflow
1. Edit content in Sanity Studio
2. Click "Publish"
3. Sanity sends webhook to Vercel
4. Vercel regenerates affected pages (5-10 seconds)
5. Site automatically updates - no manual deployment needed!

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js ISR Guide](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Sanity + Next.js Guide](https://www.sanity.io/guides/sanity-nextjs-guide)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

## Support

If you encounter issues:
1. Check Vercel logs for errors
2. Verify environment variables
3. Test webhook in Sanity dashboard
4. Check DNS propagation: `nslookup yourdomain.com`
5. Review this guide's troubleshooting section

---

**Migration complete!** Your site is now statically generated, SEO-optimized, and automatically updates when you publish content in Sanity. 🎉
