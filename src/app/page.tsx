import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

export default function HomePage() {
  const data = getToolsData();
  const { tools, last_updated, total_tools } = data;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                AI Marketing Tools Tracker
              </h1>
              <p className="text-slate-400">
                {total_tools} curated AI tools to grow your business
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Last updated</p>
              <p className="text-sm font-medium text-violet-400">
                {formatDate(last_updated)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tools.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No tools yet</h2>
            <p className="text-slate-400 mb-6">Run the scraper to populate the database</p>
            <code className="inline-block bg-slate-800 px-4 py-2 rounded text-violet-300 text-sm">
              python backend/scraper.py
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const slug = slugify(tool.name);
              const { link: affiliateLink } = getAffiliateLink(
                tool.website || tool.url,
                tool.name,
                tool.url
              );

              return (
                <div
                  key={tool.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      {tool.tagline}
                    </p>

                    {/* Topics */}
                    {tool.topics && tool.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tool.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs font-medium bg-violet-500/10 text-violet-300 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Summary */}
                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {tool.ai_summary || tool.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {tool.votesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {tool.commentsCount}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/tool/${slug}`}
                        className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        Details
                      </Link>
                      <AffiliateLink
                        href={affiliateLink}
                        toolName={tool.name}
                        className="px-4 py-1.5 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors inline-flex items-center gap-1"
                      >
                        Visit
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </AffiliateLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-500 text-sm">
            Updated daily with the latest AI marketing tools
          </p>
        </div>
      </footer>
    </div>
  );
}
