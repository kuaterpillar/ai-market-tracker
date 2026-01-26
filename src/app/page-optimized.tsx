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

function isNew(dateString: string): boolean {
  const toolDate = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - toolDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

export default function HomePage() {
  const data = getToolsData();
  const { tools, last_updated, total_tools } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header - Sticky avec effet blur */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                🚀 AI Marketing Tools
              </h1>
              <p className="text-slate-600 font-medium">
                {total_tools} curated tools to grow your business
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Updated {formatDate(last_updated)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 mb-6">
              <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">No tools yet</h2>
            <p className="text-slate-600 mb-6 text-lg">Run the scraper to populate the database</p>
            <code className="inline-block bg-slate-900 text-orange-400 px-6 py-3 rounded-lg text-sm font-mono">
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
              const isNewTool = isNew(tool.createdAt);

              return (
                <div
                  key={tool.id}
                  className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                >
                  {/* Badge "NEW" */}
                  {isNewTool && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                      ✨ NEW
                    </span>
                  )}

                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {tool.tagline}
                    </p>

                    {/* Topics - Pills colorés */}
                    {tool.topics && tool.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tool.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-700 rounded-full border border-orange-200"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Summary - Zone grise claire */}
                  <div className="mb-4 flex-grow bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                      💡 {tool.ai_summary || tool.description}
                    </p>
                  </div>

                  {/* Footer avec stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {tool.votesCount}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {tool.commentsCount}
                      </span>
                    </div>
                    <Link
                      href={`/tool/${slug}`}
                      className="text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors underline"
                    >
                      More details →
                    </Link>
                  </div>

                  {/* CTA Button - GROS et visible */}
                  <AffiliateLink
                    href={affiliateLink}
                    toolName={tool.name}
                    className="w-full py-4 px-6 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center gap-2"
                  >
                    <span>Visit Tool</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </AffiliateLink>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 text-sm font-medium">
            🔄 Updated daily with the latest AI marketing tools • Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
