import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAffiliateLink } from '@/lib/affiliate';
import AffiliateLink from '@/components/AffiliateLink';

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

function getToolBySlug(slug: string): Tool | null {
  const data = getToolsData();
  return data.tools.find(tool => slugify(tool.name) === slug) || null;
}

export async function generateStaticParams() {
  const data = getToolsData();
  return data.tools.map(tool => ({
    slug: slugify(tool.name),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - AI Marketing Tools Tracker`,
    description: tool.ai_summary || tool.tagline,
    openGraph: {
      title: tool.name,
      description: tool.ai_summary || tool.tagline,
      type: 'website',
    },
  };
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const { link: affiliateLink } = getAffiliateLink(
    tool.website || tool.url,
    tool.name,
    tool.url
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all tools
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tool Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {tool.name}
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            {tool.tagline}
          </p>

          {/* Topics */}
          {tool.topics && tool.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.topics.map((topic, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 text-sm font-medium bg-violet-500/10 text-violet-300 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-slate-400 mb-8">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {tool.votesCount} upvotes
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              {tool.commentsCount} comments
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(tool.createdAt)}
            </span>
          </div>

          {/* CTA Button */}
          <AffiliateLink
            href={affiliateLink}
            toolName={tool.name}
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
          >
            Visit {tool.name}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </AffiliateLink>
        </div>

        {/* AI Summary Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            How This Makes You Money
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            {tool.ai_summary}
          </p>
        </div>

        {/* Description Section */}
        {tool.description && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-white mb-4">About {tool.name}</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {tool.description}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-500 text-sm">
            <Link href="/" className="hover:text-violet-400 transition-colors">
              Discover more AI marketing tools
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
