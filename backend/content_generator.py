#!/usr/bin/env python3
"""
AI Content Generator - Autonomous Blog Article Generation
Generates SEO-optimized blog articles daily using Claude AI
"""

import os
import json
import random
from datetime import datetime
from pathlib import Path
import anthropic

# Article topics for SEO (rotated automatically)
ARTICLE_TOPICS = [
    {
        "title": "Best AI Marketing Tools for Small Businesses in {year}",
        "keywords": "AI marketing tools, small business marketing, marketing automation",
        "category": "Tools Review"
    },
    {
        "title": "How to Automate Your Social Media Marketing with AI",
        "keywords": "social media automation, AI social media, marketing automation",
        "category": "Tutorial"
    },
    {
        "title": "AI Copywriting Tools: Complete Guide for Marketers",
        "keywords": "AI copywriting, content generation, marketing copy",
        "category": "Guide"
    },
    {
        "title": "Top {count} AI SEO Tools to Boost Your Rankings",
        "keywords": "AI SEO tools, search engine optimization, SEO automation",
        "category": "Tools Review"
    },
    {
        "title": "Marketing Automation with AI: Complete Beginner's Guide",
        "keywords": "marketing automation, AI marketing, automation tools",
        "category": "Guide"
    },
    {
        "title": "AI Email Marketing: How to 10x Your Conversion Rate",
        "keywords": "AI email marketing, email automation, conversion optimization",
        "category": "Tutorial"
    },
    {
        "title": "Best AI Analytics Tools for Data-Driven Marketing",
        "keywords": "AI analytics, marketing analytics, data-driven marketing",
        "category": "Tools Review"
    },
    {
        "title": "AI vs Traditional Marketing: What's Better in {year}?",
        "keywords": "AI marketing, traditional marketing, marketing comparison",
        "category": "Analysis"
    },
    {
        "title": "How AI is Revolutionizing Content Marketing",
        "keywords": "AI content marketing, content automation, AI writing",
        "category": "Analysis"
    },
    {
        "title": "AI-Powered Customer Service: Tools and Best Practices",
        "keywords": "AI customer service, chatbots, customer support automation",
        "category": "Guide"
    }
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

def generate_article_with_claude(topic, tools):
    """Generate SEO article using Claude AI"""

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set - skipping article generation")
        return None

    client = anthropic.Anthropic(api_key=api_key)

    # Select 5 relevant tools for the article
    featured_tools = random.sample(tools, min(5, len(tools)))
    tools_data = "\n".join([
        f"- {tool['name']}: {tool['tagline']} (URL: {tool.get('website', tool['url'])})"
        for tool in featured_tools
    ])

    # Generate with variables
    year = datetime.now().year
    title = topic['title'].format(year=year, count=random.choice([5, 7, 10]))

    prompt = f"""You are an expert SEO content writer specializing in AI marketing tools.

Write a comprehensive, engaging blog post with the following specifications:

TITLE: {title}

TARGET KEYWORDS: {topic['keywords']}
CATEGORY: {topic['category']}
WORD COUNT: 1800-2200 words

FEATURED TOOLS (integrate these naturally):
{tools_data}

STRUCTURE:
1. Compelling introduction (hook + problem + promise)
2. Main content with H2 sections
3. Tool recommendations with affiliate-friendly descriptions
4. Practical examples and use cases
5. Strong call-to-action

REQUIREMENTS:
- SEO optimized (use target keywords naturally)
- Conversational but professional tone
- Include specific stats and data when possible
- Create urgency and FOMO
- Natural integration of affiliate links
- Mobile-friendly formatting
- Engaging subheadings

OUTPUT FORMAT: Markdown with proper H2 (##) and H3 (###) structure.

Write the article now:"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        article_content = message.content[0].text

        # Create meta description
        meta_prompt = f"""Based on this article title: "{title}"

Write a compelling meta description (140-155 characters) that:
- Includes main keyword
- Creates urgency
- Encourages clicks

Output only the meta description, nothing else:"""

        meta_message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=100,
            messages=[
                {"role": "user", "content": meta_prompt}
            ]
        )

        meta_description = meta_message.content[0].text.strip().strip('"')

        return {
            "title": title,
            "content": article_content,
            "meta_description": meta_description,
            "category": topic['category'],
            "keywords": topic['keywords'],
            "featured_tools": [tool['name'] for tool in featured_tools]
        }

    except Exception as e:
        print(f"Error generating article: {e}")
        return None

def create_slug(title):
    """Create URL-friendly slug"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')

def save_article(article_data):
    """Save article to filesystem and update blog index"""

    slug = create_slug(article_data['title'])
    date = datetime.now().strftime('%Y-%m-%d')

    # Create article directory
    article_dir = Path(__file__).parent.parent / 'src' / 'app' / 'blog' / slug
    article_dir.mkdir(parents=True, exist_ok=True)

    # Create page.tsx for the article
    page_content = f'''import type {{ Metadata }} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {{
  title: "{article_data['title']} | AI Market Tracker Blog",
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
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-violet-500/10 text-violet-300 text-xs font-bold rounded-full uppercase">
              {article_data['category']}
            </span>
            <span className="text-sm text-slate-500">{date}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {article_data['title']}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>By AI Market Tracker</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-bold
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-slate-300 prose-ul:mb-6
          prose-li:mb-2
          prose-code:text-violet-300 prose-code:bg-slate-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
        ">
          <div dangerouslySetInnerHTML={{{{ __html: `{article_data['content'].replace('`', '\\`')}` }}}} />
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to supercharge your marketing?</h3>
            <p className="text-slate-400 mb-6">Discover 100+ AI tools updated daily</p>
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

    # Add new post
    posts.insert(0, {
        "slug": slug,
        "title": article_data['title'],
        "description": article_data['meta_description'],
        "date": date,
        "readTime": "8 min read",
        "category": article_data['category'],
        "author": "AI Market Tracker",
        "keywords": article_data['keywords'],
        "featured_tools": article_data['featured_tools']
    })

    # Keep only last 50 posts
    posts = posts[:50]

    with open(blog_index_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"✅ Article saved: {slug}")
    print(f"   Title: {article_data['title']}")
    print(f"   Category: {article_data['category']}")
    print(f"   URL: /blog/{slug}")

    return slug

def main():
    """Main execution"""
    print("🤖 Starting autonomous content generation...")

    # Load tools
    tools = load_tools_data()
    if not tools:
        print("❌ No tools found - cannot generate article")
        return

    print(f"✅ Loaded {len(tools)} tools")

    # Select random topic
    topic = random.choice(ARTICLE_TOPICS)
    print(f"📝 Generating article: {topic['title']}")

    # Generate article
    article_data = generate_article_with_claude(topic, tools)

    if article_data:
        # Save article
        slug = save_article(article_data)
        print(f"\n🎉 SUCCESS! Article generated and saved")
        print(f"   Access at: /blog/{slug}")
    else:
        print("❌ Failed to generate article")

if __name__ == "__main__":
    main()
