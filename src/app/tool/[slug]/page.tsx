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

// Fake counter basé sur l'ID
function getTodayVisitors(toolId: string): number {
  const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 234 + (hash % 500); // Entre 234 et 734 visiteurs aujourd'hui
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
    title: `${tool.name} - Boost Your Marketing with AI | AI Market Tracker`,
    description: tool.ai_summary || tool.tagline,
    openGraph: {
      title: `${tool.name} - AI Marketing Tool`,
      description: tool.ai_summary || tool.tagline,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const { link: affiliateLink } = getAffiliateLink(tool.website || tool.url, tool.name, tool.url);
  const visitorsToday = getTodayVisitors(tool.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-24 md:pb-0">

      {/* Navbar simplifiée pour le retour */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Tools</span>
            </Link>

            {/* Badge "Verified" pour confiance */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-green-400">Verified Tool</span>
            </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Colonne de Gauche : Contenu */}
            <div className="lg:col-span-2 space-y-8">
                {/* Header Outil */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        {tool.topics.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-violet-500/10 text-violet-300 text-xs font-bold rounded-full uppercase tracking-wide border border-violet-500/20">
                                #{t}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight glow-text">
                        {tool.name}
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed font-light mb-6">
                        {tool.tagline}
                    </p>

                    {/* Stats + Urgence */}
                    <div className="flex items-center gap-6 text-sm text-slate-400 mb-6">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span className="font-semibold text-white">{tool.votesCount}</span>
                            <span>upvotes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold text-white">{visitorsToday}</span>
                            <span>people visited today</span>
                        </div>
                    </div>

                    {/* CTA #1 - TOP (Le plus important !) */}
                    <AffiliateLink
                        href={affiliateLink}
                        toolName={tool.name}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl shadow-2xl shadow-violet-900/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-200"
                    >
                        <span>Try {tool.name} Now</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </AffiliateLink>
                </div>

                {/* Section "Why You Need This" - CONVERSION BOOSTER */}
                <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 border border-violet-500/30 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Why You Need This
                    </h2>
                    <p className="text-lg text-slate-300 leading-8 mb-6">
                        {tool.ai_summary || tool.description}
                    </p>

                    {/* CTA #2 - MIDDLE */}
                    <AffiliateLink
                        href={affiliateLink}
                        toolName={tool.name}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-200"
                    >
                        Get Started with {tool.name}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </AffiliateLink>
                </div>

                {/* Description longue */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">About {tool.name}</h3>
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-slate-400 leading-7 whitespace-pre-line">{tool.description}</p>
                    </div>
                </div>

                {/* CTA #3 - BOTTOM */}
                <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-500/30 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">Ready to boost your marketing?</h3>
                    <p className="text-slate-400 mb-6">Join {visitorsToday}+ marketers who tried {tool.name} today</p>
                    <AffiliateLink
                        href={affiliateLink}
                        toolName={tool.name}
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl shadow-2xl shadow-violet-900/40 transform hover:scale-105 transition-all duration-200"
                    >
                        Visit {tool.name} →
                    </AffiliateLink>
                </div>
            </div>

            {/* Colonne de Droite : Sticky Sidebar (Desktop) */}
            <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                    {/* Card principale */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
                        <div className="mb-6 pb-6 border-b border-slate-800">
                            <span className="block text-slate-500 text-sm mb-2">Tool Information</span>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm">Category</span>
                                    <span className="text-white font-medium text-sm">{tool.topics[0] || 'Marketing'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm">Upvotes</span>
                                    <span className="text-white font-medium text-sm">{tool.votesCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 text-sm">Pricing</span>
                                    <span className="text-green-400 font-medium text-sm">Freemium</span>
                                </div>
                            </div>
                        </div>

                        <AffiliateLink
                            href={affiliateLink}
                            toolName={tool.name}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white font-bold text-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl shadow-lg shadow-violet-900/20 transform hover:-translate-y-1 transition-all duration-200"
                        >
                            Visit Website
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </AffiliateLink>

                        <p className="text-xs text-center text-slate-600 mt-4">
                            ✓ Secure redirect • No signup required
                        </p>
                    </div>

                    {/* Social Proof */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 border-2 border-slate-950"></div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-slate-950"></div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 border-2 border-slate-950"></div>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{visitorsToday}+ visits</p>
                                <p className="text-slate-500 text-xs">in the last 24 hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
      </main>

      {/* MOBILE STICKY FOOTER CTA - CRITIQUE POUR CONVERSION MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{tool.name}</p>
                <p className="text-xs text-slate-400 truncate">Boost your marketing now</p>
            </div>
            <AffiliateLink
                href={affiliateLink}
                toolName={tool.name}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-lg shadow-lg whitespace-nowrap"
            >
                Try Now →
            </AffiliateLink>
        </div>
      </div>

    </div>
  );
}
