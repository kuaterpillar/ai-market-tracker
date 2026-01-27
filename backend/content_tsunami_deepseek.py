#!/usr/bin/env python3
"""
CONTENT TSUNAMI - DeepSeek LOCAL Edition
Uses Ollama + DeepSeek for 100% FREE content generation
NO API KEY REQUIRED - Runs completely locally
"""

import os
import json
import random
import subprocess
from datetime import datetime
from pathlib import Path
import time

# 20+ ULTRA-SEO TOPICS
ARTICLE_TOPICS = [
    {"title": "Best AI Marketing Tools {year}: Complete Guide", "keywords": "AI marketing tools, marketing automation", "category": "Tools Review", "priority": "high"},
    {"title": "{count} AI Tools Every Marketer Needs in {year}", "keywords": "AI tools for marketers, marketing tools", "category": "Listicle", "priority": "high"},
    {"title": "How to Automate Your Marketing with AI", "keywords": "marketing automation, AI automation", "category": "Tutorial", "priority": "high"},
    {"title": "AI Copywriting Tools: Complete Comparison {year}", "keywords": "AI copywriting, copywriting tools", "category": "Comparison", "priority": "high"},
    {"title": "Best AI SEO Tools to Rank #1 on Google", "keywords": "AI SEO tools, SEO automation", "category": "Tools Review", "priority": "high"},
    {"title": "AI Email Marketing: 10x Your Open Rates", "keywords": "AI email marketing, email automation", "category": "Tutorial", "priority": "medium"},
    {"title": "AI vs Traditional Marketing: Complete Guide", "keywords": "AI marketing, traditional marketing", "category": "Analysis", "priority": "medium"},
    {"title": "How to Use ChatGPT for Marketing: {count} Strategies", "keywords": "ChatGPT marketing, AI marketing", "category": "Guide", "priority": "high"},
    {"title": "AI Social Media Marketing: Complete Guide", "keywords": "AI social media, social media automation", "category": "Guide", "priority": "medium"},
    {"title": "AI Content Creation for Busy Entrepreneurs", "keywords": "AI content creation, content tools", "category": "Tools Review", "priority": "medium"},
    {"title": "Best AI Analytics Tools for Marketing", "keywords": "AI analytics, marketing analytics", "category": "Tools Review", "priority": "medium"},
    {"title": "How AI is Transforming E-commerce Marketing", "keywords": "AI ecommerce, ecommerce marketing", "category": "Analysis", "priority": "low"},
    {"title": "AI Customer Service Tools & Best Practices", "keywords": "AI customer service, chatbots", "category": "Guide", "priority": "medium"},
    {"title": "Marketing Automation for Startups: Guide", "keywords": "marketing automation, startup marketing", "category": "Guide", "priority": "high"},
    {"title": "Best Free AI Marketing Tools {year}", "keywords": "free AI tools, free marketing tools", "category": "Listicle", "priority": "high"},
    {"title": "How to Scale Marketing Without a Team", "keywords": "scale marketing, solo marketing", "category": "Tutorial", "priority": "high"},
    {"title": "AI Marketing ROI: How Much Can You Make?", "keywords": "AI marketing ROI, marketing profitability", "category": "Analysis", "priority": "medium"},
    {"title": "From $0 to $10k with AI Marketing Tools", "keywords": "make money online, AI marketing income", "category": "Case Study", "priority": "high"},
    {"title": "AI Personalization: 5x Your Conversions", "keywords": "AI personalization, conversion optimization", "category": "Tutorial", "priority": "high"},
    {"title": "Building a Marketing Funnel with AI", "keywords": "marketing funnel, AI funnel", "category": "Tutorial", "priority": "medium"},
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

def call_ollama_deepseek(prompt, model="deepseek-7b-chat"):
    """Call Ollama DeepSeek locally - 100% FREE"""
    try:
        print(f"   Calling DeepSeek locally...")

        # Use subprocess to call ollama
        result = subprocess.run(
            ['ollama', 'run', model, prompt],
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )

        if result.returncode == 0:
            return result.stdout.strip()
        else:
            print(f"   ERROR: Ollama error: {result.stderr}")
            return None

    except subprocess.TimeoutExpired:
        print("   ERROR: Timeout - DeepSeek took too long")
        return None
    except Exception as e:
        print(f"   ERROR calling DeepSeek: {e}")
        return None

def generate_ultra_article_deepseek(topic, tools, article_number=1):
    """Generate ULTRA article using DeepSeek LOCAL"""

    # Select tools
    num_tools = min(7, len(tools)) if topic['priority'] == 'high' else min(5, len(tools))
    featured_tools = random.sample(tools, num_tools)

    tools_data = "\n".join([
        f"- **{tool['name']}**: {tool['tagline']} - {tool.get('website', tool['url'])}"
        for tool in featured_tools
    ])

    # Variables
    year = datetime.now().year
    count = random.choice([5, 7, 10, 15])
    title = topic['title'].format(year=year, count=count)

    prompt = f"""You are an expert SEO content writer. Write a comprehensive blog article.

TITLE: {title}

KEYWORDS: {topic['keywords']}
CATEGORY: {topic['category']}

Write a 2000+ word article with this structure:

1. Introduction (150 words)
   - Hook with shocking stat
   - Problem identification
   - Solution promise

2. Main Problem (300 words)
   - Deep dive into pain points
   - Why it matters

3. Tool Reviews (1200 words)
   Featured tools to review:
{tools_data}

   For EACH tool write:
   - What it does (100 words)
   - Key features
   - Pricing
   - Best for
   - CTA: "Try [tool] now →"

4. How-To Guide (400 words)
   - Step-by-step using these tools
   - Best practices

5. FAQ (200 words)
   - Answer 5 common questions

6. Conclusion (100 words)
   - Recap benefits
   - Strong CTA

Use Markdown format with ## for H2 and ### for H3.
Include keywords naturally.
Make it actionable and engaging.

Write the article now:"""

    print(f"   Generating article with DeepSeek...")
    content = call_ollama_deepseek(prompt)

    if not content or len(content) < 500:
        print(f"   ERROR: Article too short or failed")
        return None

    # Generate meta description
    meta_prompt = f"Write a 150-character meta description for this article title: '{title}'. Make it compelling and include the main keyword. Just the description, nothing else:"

    meta = call_ollama_deepseek(meta_prompt)
    if not meta:
        meta = f"Complete guide to {topic['keywords']}. Learn strategies, tools, and tips to boost your marketing."

    # Clean meta description
    meta = meta.strip().strip('"')[:155]

    word_count = len(content.split())
    print(f"   SUCCESS: Article generated ({word_count} words)")

    return {
        "title": title,
        "content": content,
        "meta_description": meta,
        "category": topic['category'],
        "keywords": topic['keywords'],
        "featured_tools": [t['name'] for t in featured_tools],
        "priority": topic['priority'],
        "word_count": word_count
    }

def create_slug(title):
    """Create URL-friendly slug"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')[:60]

def save_article(article_data, article_number=1):
    """Save article and update index"""

    slug = create_slug(article_data['title'])
    date = datetime.now().strftime('%Y-%m-%d')

    # Ensure unique slug
    base_slug = slug
    counter = 1
    article_dir = Path(__file__).parent.parent / 'src' / 'app' / 'blog' / slug
    while article_dir.exists():
        slug = f"{base_slug}-{counter}"
        article_dir = Path(__file__).parent.parent / 'src' / 'app' / 'blog' / slug
        counter += 1

    article_dir.mkdir(parents=True, exist_ok=True)

    # Escape content for JSX
    content_escaped = article_data['content'].replace('`', '\\`').replace('$', '\\$').replace('{', '\\{').replace('}', '\\}')

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
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
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
            <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-full">
              🤖 DeepSeek AI
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
            <span className="text-green-400">100% Free AI</span>
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
        ">
          <div dangerouslySetInnerHTML={{{{ __html: `{content_escaped}`.replace(/\\n/g, '<br />') }}}} />
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to 10x your marketing?</h3>
            <p className="text-slate-400 mb-6">Discover 100+ AI tools updated daily</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-900/50 transform hover:scale-105 transition-all duration-200"
            >
              Explore All Tools →
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
        "author": "AI Market Tracker (DeepSeek)",
        "keywords": article_data['keywords'],
        "featured_tools": article_data['featured_tools'],
        "priority": article_data['priority'],
        "word_count": article_data['word_count']
    })

    posts = posts[:100]

    with open(blog_index_path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

    print(f"   SUCCESS: Article saved: {slug}")
    return slug

def main():
    """Generate articles with DeepSeek LOCAL"""

    print("CONTENT TSUNAMI - DeepSeek LOCAL Edition")
    print("100% FREE - No API keys required!")
    print("=" * 60)

    num_articles = int(os.environ.get('NUM_ARTICLES', 1))
    print(f"Generating {num_articles} article(s) with DeepSeek...\n")

    tools = load_tools_data()
    if not tools:
        print("ERROR: No tools found")
        return

    print(f"Loaded {len(tools)} tools\n")

    topics = ARTICLE_TOPICS.copy()
    random.shuffle(topics)

    articles_generated = 0

    for i in range(num_articles):
        print(f"\nARTICLE {i+1}/{num_articles}")
        print("-" * 60)

        topic = topics[i % len(topics)]
        print(f"   Topic: {topic['title'][:50]}...")
        print(f"   Category: {topic['category']}")

        article = generate_ultra_article_deepseek(topic, tools, i+1)

        if article:
            slug = save_article(article, i+1)
            articles_generated += 1
            print(f"   SUCCESS! URL: /blog/{slug}")

            if i < num_articles - 1:
                print(f"   Waiting 10 seconds...")
                time.sleep(10)
        else:
            print(f"   FAILED")

    print("\n" + "=" * 60)
    print(f"CONTENT TSUNAMI COMPLETE!")
    print(f"   Articles: {articles_generated}/{num_articles}")
    print(f"   Total words: ~{articles_generated * 2000}")
    print(f"   100% FREE with DeepSeek!")
    print("=" * 60)

if __name__ == "__main__":
    main()
