#!/usr/bin/env node
/**
 * Automatic Sitemap Generator
 * Generates sitemap.xml with all pages for SEO
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://ai-market-tracker.vercel.app';

function generateSitemap() {
  const urls = [];

  // Homepage
  urls.push({
    loc: SITE_URL,
    changefreq: 'daily',
    priority: 1.0
  });

  // Blog index
  urls.push({
    loc: `${SITE_URL}/blog`,
    changefreq: 'daily',
    priority: 0.9
  });

  // Load tools
  try {
    const toolsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/tools.json'), 'utf8')
    );

    toolsData.tools.forEach(tool => {
      const slug = tool.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      urls.push({
        loc: `${SITE_URL}/tool/${slug}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  } catch (error) {
    console.error('Error loading tools:', error);
  }

  // Load blog posts
  try {
    const blogPosts = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/blog-posts.json'), 'utf8')
    );

    blogPosts.forEach(post => {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Save sitemap
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);

  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
  console.log(`   Path: ${sitemapPath}`);
}

generateSitemap();
