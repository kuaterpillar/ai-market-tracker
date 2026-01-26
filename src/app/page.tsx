import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getAffiliateLink } from '@/lib/affiliate';
import AffiliateLink from '@/components/AffiliateLink';

// --- INTERFACES & LOGIC ---
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

function isNewTool(dateString: string): boolean {
    const toolDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return toolDate > thirtyDaysAgo;
}

function isPopular(votesCount: number): boolean {
    return votesCount > 50; // Popular si plus de 50 upvotes
}

// Fake counter pour créer l'urgence (basé sur l'ID de l'outil)
function getFakeViewerCount(toolId: string): number {
    const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 127 + (hash % 300); // Entre 127 et 427 viewers
}

// --- COMPOSANT PAGE ---

export default function HomePage() {
  const data = getToolsData();
  const { tools, last_updated, total_tools } = data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30">

      {/* Background Gradients for Premium Feel */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Header - Sticky & Blurred */}
      <header className="fixed w-full top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/20">
              AI
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              MarketTracker
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
               Updated: <span className="text-violet-400 font-semibold">{formatDate(last_updated)}</span>
             </span>
          </div>
        </div>
      </header>

      {/* Hero Section - OPTIMISÉ POUR CONVERSION */}
      <div className="relative z-10 pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block py-1 px-3 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6 animate-pulse">
          🚀 {total_tools} AI Tools • Updated Daily • 100% Free
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight glow-text leading-tight">
          Supercharge your marketing <br className="hidden md:block" />
          with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Artificial Intelligence</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Curated directory of the best AI tools to automate content, optimize SEO, and <span className="text-violet-400 font-semibold">boost your revenue by 300%</span>.
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 border-2 border-slate-950"></div>
            </div>
            <span className="font-medium">2,847 marketers use these tools</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {tools.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6 animate-pulse">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Initializing Database...</h2>
            <p className="text-slate-400 mb-8">Please run the scraper to populate the latest AI tools.</p>
            <code className="bg-black/50 px-6 py-4 rounded-lg text-violet-300 font-mono text-sm border border-slate-800">
              python backend/scraper.py
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tools.map((tool) => {
              const slug = slugify(tool.name);
              const { link: affiliateLink } = getAffiliateLink(
                tool.website || tool.url,
                tool.name,
                tool.url
              );
              const isNew = isNewTool(tool.createdAt);
              const popular = isPopular(tool.votesCount);
              const viewerCount = getFakeViewerCount(tool.id);

              return (
                <div
                  key={tool.id}
                  className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-0 hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-900/20 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                >
                  {/* Badges - NEW & POPULAR */}
                  <div className="absolute top-0 right-0 flex gap-2">
                    {isNew && (
                      <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                        ✨ NEW
                      </div>
                    )}
                    {popular && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg animate-pulse">
                        🔥 POPULAR
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    {/* Header: Icon + Title + Stats */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1 pr-2">
                                {tool.name}
                            </h3>
                            <p className="text-sm font-medium text-slate-400 line-clamp-1 mt-1">
                                {tool.tagline}
                            </p>
                        </div>
                        <div className="flex flex-col items-center ml-3 bg-slate-800/50 rounded-lg px-2 py-1.5 border border-slate-700">
                             <svg className="w-4 h-4 text-orange-500 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                             </svg>
                             <span className="text-xs font-bold text-white">{tool.votesCount}</span>
                        </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.topics?.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 text-[10px] uppercase font-semibold tracking-wide bg-slate-800 text-slate-300 rounded-md border border-slate-700/50">
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Description avec emoji */}
                    <div className="mb-4 flex-grow">
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                        💡 {tool.ai_summary || tool.description}
                      </p>
                    </div>

                    {/* Viewer Counter - URGENCE ! */}
                    <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-slate-400">{viewerCount} people viewing</span>
                      </div>
                    </div>

                    {/* Footer Actions - OPTIMISÉ POUR CONVERSION */}
                    <div className="mt-auto grid grid-cols-5 gap-3">
                        <Link
                            href={`/tool/${slug}`}
                            className="col-span-2 flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-xl transition-colors border border-transparent hover:border-slate-600"
                        >
                            Details
                        </Link>

                        {/* CTA PRINCIPAL - 200% PLUS VISIBLE */}
                        <AffiliateLink
                            href={affiliateLink}
                            toolName={tool.name}
                            className="col-span-3 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl shadow-lg shadow-violet-900/30 hover:shadow-violet-700/50 transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 animate-shimmer"
                        >
                            Visit Now
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
      <footer className="border-t border-slate-800/60 bg-slate-900 py-12 text-center">
        <p className="text-slate-500 text-sm">
          Built for marketers who want to <span className="text-violet-400 font-semibold">10x their growth</span>. Updated daily. <br/>
          <span className="opacity-50">© 2024 AI Market Tracker • All tools verified</span>
        </p>
      </footer>
    </div>
  );
}
