import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ai_summary: string;
  url: string;
  website?: string;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
  topics: string[];
}

interface ToolsData {
  last_updated: string;
  total_tools: number;
  tools: Tool[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getToolsData(): ToolsData {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'tools.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading tools data:', error);
    return {
      last_updated: new Date().toISOString(),
      total_tools: 0,
      tools: []
    };
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getToolsData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(data.last_updated),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Individual tool pages
  const toolPages = data.tools.map((tool) => ({
    url: `${baseUrl}/tool/${slugify(tool.name)}`,
    lastModified: new Date(tool.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...toolPages];
}
