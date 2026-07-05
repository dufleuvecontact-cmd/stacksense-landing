# StackSense blog

Static HTML pages served straight from `public/blog/`. No build step, no framework. Vercel serves real files in `public/` before the SPA catch-all rewrite, which is why these pages resolve and stay crawlable without JavaScript.

## Files

- `blog.css` - the one shared stylesheet for every blog page (header, footer, article layout, index cards)
- `index.html` - the blog landing page with post cards
- `_TEMPLATE.html` - copy this to create a new post (the leading underscore keeps it out of the index; do not link to it)
- `*.html` - the posts

## How to add a new post

1. **Copy the template.** `cp _TEMPLATE.html your-slug.html`. Slug: lowercase, hyphens, keyword-rich, ends in `.html`. Never rename an existing post's file; the URLs are indexed.
2. **Fill the `<head>`.** Every `FILL IN` comment: flip the robots meta from `noindex, follow` to `index, follow`, then title, meta description, canonical (must match the final URL exactly), og/twitter tags, Article JSON-LD (headline, description, `datePublished` as YYYY-MM-DD, `mainEntityOfPage`). If the post has a FAQ, uncomment and fill the FAQPage JSON-LD; the JSON text must match the visible FAQ copy.
3. **Fill the body.** Breadcrumb segment, H1, byline (date plus read time: word count / 200, rounded), lede, sections, CTA band. In the CTA link, set `utm_content` to the post slug. Keep the disclaimer on anything health-adjacent. Do not touch the header or footer blocks.
4. **Fill related articles.** 2 to 3 links to other posts. Also add a link to the new post in the related section of 1 or 2 older posts so it gets internal links.
5. **Add a card to `index.html`.** Copy an existing `<a class="post-card">` block inside `.post-grid`, fill in tag (category like Peptides, GLP-1, Guides), title, excerpt (1 to 2 lines), date, and read time. Newest post goes first.
6. **Add the URL to `public/sitemap.xml`.** Copy an existing `<url>` block:
   ```xml
   <url>
     <loc>https://stacksense.ca/blog/your-slug.html</loc>
     <lastmod>YYYY-MM-DD</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.8</priority>
   </url>
   ```
   Also bump the `<lastmod>` on the `https://stacksense.ca/blog/` entry.

## Rules

- No em dashes in copy.
- No new inline `<style>` blocks; if a post needs a new element style, add it to `blog.css` once.
- No client-side rendering of article content and no external scripts; these pages must work with JavaScript disabled.
- Tracking guides only: no dosing, no protocols, no medical advice. Keep the disclaimer.
