#!/usr/bin/env python3
"""
CONTENT TSUNAMI - Ultra-Aggressive Content Generation
Generates 3-5 SEO articles per day + cross-posts to multiple platforms
"""

import os
import json
import random
from datetime import datetime
from pathlib import Path
import anthropic
import time

# 20+ ULTRA-SEO TOPICS (rotation automatique)
ARTICLE_TOPICS = [
    # High-volume keywords
    {"title": "Best AI Marketing Tools {year}: Complete Guide for Marketers", "keywords": "AI marketing tools, marketing automation, best AI tools", "category": "Tools Review", "priority": "high"},
    {"title": "{count} AI Tools Every Marketer Needs in {year}", "keywords": "AI tools for marketers, marketing tools, AI software", "category": "Listicle", "priority": "high"},
    {"title": "How to Automate Your Marketing with AI in {year}", "keywords": "marketing automation, AI automation, automate marketing", "category": "Tutorial", "priority": "high"},

    # Buyer intent keywords
    {"title": "AI Copywriting Tools: Ultimate Comparison & Review {year}", "keywords": "AI copywriting, copywriting tools, AI writing software", "category": "Comparison", "priority": "high"},
    {"title": "Best AI SEO Tools to Rank #1 on Google", "keywords": "AI SEO tools, SEO automation, search optimization", "category": "Tools Review", "priority": "high"},
    {"title": "AI Email Marketing: How to 10x Your Open Rates", "keywords": "AI email marketing, email automation, email open rates", "category": "Tutorial", "priority": "medium"},

    # Long-tail keywords
    {"title": "AI vs Traditional Marketing: Which is Better for Small Business?", "keywords": "AI marketing, traditional marketing, small business marketing", "category": "Analysis", "priority": "medium"},
    {"title": "How to Use ChatGPT for Marketing: {count} Proven Strategies", "keywords": "ChatGPT marketing, AI marketing strategies, ChatGPT for business", "category": "Guide", "priority": "high"},
    {"title": "AI Social Media Marketing Tools: Complete Guide", "keywords": "AI social media, social media automation, social media tools", "category": "Guide", "priority": "medium"},

    # Specific use cases
    {"title": "AI Content Creation Tools for Busy Entrepreneurs", "keywords": "AI content creation, content tools, entrepreneur tools", "category": "Tools Review", "priority": "medium"},
    {"title": "Best AI Analytics Tools for Data-Driven Marketing", "keywords": "AI analytics, marketing analytics, data-driven marketing", "category": "Tools Review", "priority": "medium"},
    {"title": "How AI is Revolutionizing E-commerce Marketing", "keywords": "AI ecommerce, ecommerce marketing, online retail AI", "category": "Analysis", "priority": "low"},

    # Trending topics
    {"title": "AI-Powered Customer Service: Tools & Best Practices", "keywords": "AI customer service, chatbots, customer support automation", "category": "Guide", "priority": "medium"},
    {"title": "Marketing Automation for Startups: Complete Beginner's Guide", "keywords": "marketing automation, startup marketing, beginner guide", "category": "Guide", "priority": "high"},
    {"title": "Best Free AI Marketing Tools in {year}", "keywords": "free AI tools, free marketing tools, AI tools free", "category": "Listicle", "priority": "high"},

    # Problem-solution
    {"title": "How to Scale Your Marketing Without Hiring a Team", "keywords": "scale marketing, solo marketing, marketing automation", "category": "Tutorial", "priority": "high"},
    {"title": "AI Marketing ROI: How Much Money Can You Really Make?", "keywords": "AI marketing ROI, marketing profitability, AI tools ROI", "category": "Analysis", "priority": "medium"},
    {"title": "From Zero to $10k/Month with AI Marketing Tools", "keywords": "make money online, AI marketing income, passive income AI", "category": "Case Study", "priority": "high"},

    # Advanced topics
    {"title": "AI Personalization: How to 5x Your Conversion Rate", "keywords": "AI personalization, conversion optimization, personalized marketing", "category": "Tutorial", "priority": "high"},
    {"title": "Building a Marketing Funnel with AI: Step-by-Step", "keywords": "marketing funnel, AI funnel, funnel automation", "category": "Tutorial", "priority": "medium"},
]

def load_tools_data():
    """Load tools from database"""
    tools_path = Path(__file__).parent.parent / 'data' / 'tools.json'
    try:
        with open(tools_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('tools', [])
    except Exception as e:
        print(f"Error loading tools: {e}")
        return []

def generate_ultra_article(topic, tools, article_number=1):
    """Generate ULTRA-SEO optimized article with Claude"""

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set")
        return None

    client = anthropic.Anthropic(api_key=api_key)

    # Select tools
    num_tools = min(7, len(tools)) if topic['priority'] == 'high' else min(5, len(tools))
    featured_tools = random.sample(tools, num_tools)

    tools_data = "\n".join([
        f"- **{tool['name']}**: {tool['tagline']} ({tool.get('votesCount', 0)} upvotes) - URL: {tool.get('website', tool['url'])}"
        for tool in featured_tools
    ])

    # Variables
    year = datetime.now().year
    count = random.choice([5, 7, 10, 15, 20])
    title = topic['title'].format(year=year, count=count)

    prompt = f"""You are an EXPERT SEO content writer who writes VIRAL marketing content.

Write an ULTRA-COMPREHENSIVE, HIGHLY-ENGAGING article:

**TITLE**: {title}

**TARGET KEYWORDS**: {topic['keywords']} (use naturally 10-15 times)
**CATEGORY**: {topic['category']}
**WORD COUNT**: 2500-3500 words (LONG-FORM for SEO dominance)
**TONE**: Professional but conversational, persuasive, action-oriented

**FEATURED TOOLS** (integrate naturally with clear CTAs):
{tools_data}

**STRUCTURE REQUIREMENTS**:

1. **HOOK INTRODUCTION** (100-150 words)
   - Start with shocking statistic or bold claim
   - Identify the problem your reader has
   - Promise the transformation/solution
   - Create urgency

2. **TABLE OF CONTENTS** (for featured snippet)
   - List all H2 sections with anchors

3. **PROBLEM SECTION** (300-400 words)
   - Deep dive into the pain points
   - Use statistics and data
   - Make reader feel understood

4. **SOLUTION OVERVIEW** (200-300 words)
   - How AI/automation solves the problem
   - Benefits and transformation

5. **TOOL REVIEWS** (Main content - 1500-2000 words)
   - Dedicate 200-300 words per tool
   - Include: What it does, Key features, Pricing, Pros/Cons, Best for
   - Add affiliate CTA after each tool: "Try {toolname} now →"

6. **COMPARISON TABLE** (for featured snippet)
   - Compare all tools side-by-side
   - Include: Price, Features, Rating, Best For

7. **HOW-TO SECTION** (400-500 words)
   - Step-by-step tutorial using the tools
   - Actionable tips and best practices

8. **CASE STUDY/EXAMPLES** (300-400 words)
   - Real examples or hypothetical success stories
   - Before/After scenarios
   - ROI calculations

9. **FAQ SECTION** (300-400 words)
   - Answer 5-7 common questions
   - Use question format for voice search SEO

10. **CONCLUSION** (150-200 words)
    - Recap transformation
    - Final CTA
    - Create FOMO

**SEO OPTIMIZATION REQUIREMENTS**:
- Use target keywords in H1, first paragraph, conclusion
- Add LSI keywords naturally throughout
- Use numbers in headings (e.g., "5 Ways to...", "Step 3:")
- Include internal links placeholders: [link to other article]
- Add image descriptions: [IMAGE: description for alt text]
- Use short paragraphs (2-3 sentences max)
- Add bullet points and numbered lists
- Include statistics and data points
- Add subheadings every 200-300 words

**CONVERSION OPTIMIZATION**:
- Add CTA after every tool review
- Create urgency ("Limited time", "Don't miss out")
- Use power words (Amazing, Incredible, Revolutionary)
- Add social proof ("10,000+ marketers use this")
- Include scarcity ("Only 100 spots left")

**OUTPUT FORMAT**: Clean Markdown with proper H2 (##) and H3 (###) hierarchy

Write the article NOW - make it VIRAL and CONVERT:"""

    try:
        print(f"   Generating article #{article_number}...")
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=8000,  # Longer for bigger articles
            messages=[{"role": "user", "content": prompt}]
        )

        content = message.content[0].text

        # Generate meta description
        meta_prompt = f"Write a compelling meta description (150-155 chars) for: '{title}'. Include main keyword. Make it click-worthy:"

        meta_message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=100,
            messages=[{"role": "user", "content": meta_prompt}]
        )

        meta = meta_message.content[0].text.strip().strip('"')

        print(f"   ✅ Article #{article_number} generated ({len(content)} chars)")

        return {
            "title": title,
            "content": content,
            "meta_description": meta,
            "category": topic['category'],
            "keywords": topic['keywords'],
            "featured_tools": [t['name'] for t in featured_tools],
            "priority": topic['priority'],
            "word_count": len(content.split())
        }

    except Exception as e:
        print(f"   ❌ Error generating article #{article_number}: {e}")
        return None

def create_slug(title):
    """Create URL-friendly slug"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')[:60]  # Limit length

def save_article(article_data, article_number=1):
    """Save article and update index"""

    slug = create_slug(article_data['title'])
    date = datetime.now().strftime('%Y-%m-%d')

    # Ensure unique slug
    base_slug = slug
    counter = 1
    while (Path(__file__).parent.parent / 'src' / 'app' / 'blog' / slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Create article page
    article_dir = Path(__file__).parent.parent / 'src' / 'app' / 'blog' / slug
    article_dir.mkdir(parents=True, exist_ok=True)

    page_content = f'''import type {{ Metadata }} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {{
  title: "{article_data['title']} | AI Market Tracker",
  description: "{article_data['meta_description']}",
  keywords: "{article_data['keywords']}",
  openGraph: {{
    title: "{article_data['title']}",
    description: "{article_data['meta_description']}",
    type: "article",
  }},
}};

export default function ArticlePage() {{
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Blog</span>
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-violet-500/10 text-violet-300 text-xs font-bold rounded-full uppercase">
              {article_data['category']}
            </span>
            <span className="px-3 py-1 bg-green-500/10 text-green-300 text-xs font-bold rounded-full">
              {article_data['word_count']} words
            </span>
            <span className="text-sm text-slate-500">{date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {article_data['title']}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>By AI Market Tracker</span>
            <span>•</span>
            <span>{article_data['word_count'] // 200} min read</span>
            <span>•</span>
            <span className="text-green-400">SEO Optimized</span>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-slate-300 prose-ul:mb-6
          prose-ol:text-slate-300 prose-ol:mb-6
          prose-li:mb-2
          prose-code:text-violet-300 prose-code:bg-slate-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-blockquote:border-l-violet-500 prose-blockquote:bg-slate-900/50 prose-blockquote:p-4
          prose-table:w-full prose-table:border-slate-800
          prose-th:bg-slate-900 prose-th:p-3 prose-th:text-left
          prose-td:border-slate-800 prose-td:p-3
        ">
          <div dangerouslySetInnerHTML={{{{ __html: `{article_data['content'].replace('`', '\\`').replace('$', '\\$')}` }}}} />
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to 10x your marketing?</h3>
            <p className="text-slate-400 mb-6">Discover 100+ AI tools updated daily - 100% free</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-900/50 transform hover:scale-105 transition-all duration-200"
            >
              Explore All Tools
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}}
'''

    page_path = article_dir / 'page.tsx'
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(page_content)

    # Update blog index
    blog_index_path = Path(__file__).parent.parent / 'data' / 'blog-posts.json'

    try:
        with open(blog_index_path, 'r', encoding='utf-8') as f:
            posts = json.load(f)
    except:
        posts = []

    posts.insert(0, {
        "slug": slug,
        "title": article_data['title'],
        "description": article_data['meta_description'],
        "date": date,
        "readTime": f"{article_data['word_count'] // 200} min read",
        "category": article_data['category'],
        "author": "AI Market Tracker",
        "keywords": article_data['keywords'],
        "featured_tools": article_data['featured_tools'],
        "priority": article_data['priority'],
        "word_count": article_data['word_count']
    })

    # Keep last 100 posts
    posts = posts[:100]

    with open(blog_index_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"   ✅ Article #{article_number} saved: {slug}")
    return slug

def main():
    """Generate multiple articles (CONTENT TSUNAMI)"""

    print("🌊 CONTENT TSUNAMI - Ultra-Aggressive Content Generation")
    print("=" * 60)

    # Number of articles to generate (default: 1, can be 3-5 in production)
    num_articles = int(os.environ.get('NUM_ARTICLES', 1))
    print(f"📝 Generating {num_articles} article(s)...")

    tools = load_tools_data()
    if not tools:
        print("❌ No tools found")
        return

    print(f"✅ Loaded {len(tools)} tools\n")

    # Shuffle topics to get variety
    topics = ARTICLE_TOPICS.copy()
    random.shuffle(topics)

    articles_generated = 0

    for i in range(num_articles):
        print(f"\n🚀 ARTICLE {i+1}/{num_articles}")
        print("-" * 60)

        topic = topics[i % len(topics)]
        print(f"   Topic: {topic['title'][:50]}...")
        print(f"   Priority: {topic['priority']}")
        print(f"   Category: {topic['category']}")

        article = generate_ultra_article(topic, tools, i+1)

        if article:
            slug = save_article(article, i+1)
            articles_generated += 1
            print(f"   🎉 SUCCESS! URL: /blog/{slug}")

            # Wait between articles to avoid rate limits
            if i < num_articles - 1:
                print(f"   ⏳ Waiting 5 seconds...")
                time.sleep(5)
        else:
            print(f"   ❌ FAILED to generate article {i+1}")

    print("\n" + "=" * 60)
    print(f"🎉 CONTENT TSUNAMI COMPLETE!")
    print(f"   Articles generated: {articles_generated}/{num_articles}")
    print(f"   Total words: ~{articles_generated * 3000}")
    print("=" * 60)

if __name__ == "__main__":
    main()
