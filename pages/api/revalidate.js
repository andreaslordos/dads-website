// API route for on-demand revalidation
// This will be called by Sanity webhooks when content is updated

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Get the slug from the request body (sent by Sanity webhook)
    const slug = req.body?.slug;

    // Revalidate homepage
    await res.revalidate('/');

    // Revalidate common pages
    await res.revalidate('/space');
    await res.revalidate('/papers');
    await res.revalidate('/awards');
    await res.revalidate('/press');
    await res.revalidate('/contact');

    // If a specific slug is provided, revalidate that page
    if (slug) {
      await res.revalidate(`/content/${slug}`);
    }

    return res.json({ revalidated: true, time: new Date().toISOString() });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
