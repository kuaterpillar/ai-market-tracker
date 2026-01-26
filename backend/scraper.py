import os
import json
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Configuration
PRODUCTHUNT_API_KEY = os.getenv('PRODUCTHUNT_API_KEY', '')
DATA_DIR = Path(__file__).parent.parent / 'data'
OUTPUT_FILE = DATA_DIR / 'tools.json'
OLLAMA_API_URL = "http://localhost:11434/api/generate"

# Marketing/E-commerce keywords filter
FILTER_KEYWORDS = [
    'marketing', 'seo', 'analytics', 'e-commerce', 'ecommerce',
    'sales', 'adtech', 'copywriting', 'email', 'crm', 'conversion',
    'automation', 'ads', 'advertising', 'growth', 'funnel', 'affiliate'
]

def fetch_producthunt_data():
    """
    Fetch latest tools from ProductHunt API
    Falls back to RSS/public endpoint if no API key
    """

    if PRODUCTHUNT_API_KEY:
        # Using official API (requires OAuth2)
        headers = {
            'Authorization': f'Bearer {PRODUCTHUNT_API_KEY}',
            'Content-Type': 'application/json'
        }

        query = """
        {
          posts(first: 50, order: VOTES) {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                commentsCount
                createdAt
                website
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
        """

        try:
            response = requests.post(
                'https://api.producthunt.com/v2/api/graphql',
                json={'query': query},
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return parse_producthunt_graphql(data)
        except Exception as e:
            print(f"[!] ProductHunt API error: {e}")
            print("Falling back to RSS feed...")
            return fetch_producthunt_rss()
    else:
        print("[i] No ProductHunt API key found, using RSS feed")
        return fetch_producthunt_rss()


def fetch_producthunt_rss():
    """
    Fallback: Parse ProductHunt Atom feed
    """
    import xml.etree.ElementTree as ET
    import re

    try:
        response = requests.get('https://www.producthunt.com/feed', timeout=30)
        response.raise_for_status()

        root = ET.fromstring(response.content)
        tools = []

        # Atom feed uses namespaces
        ns = {'atom': 'http://www.w3.org/2005/Atom'}

        for entry in root.findall('.//atom:entry', ns)[:50]:
            title_elem = entry.find('atom:title', ns)
            content_elem = entry.find('atom:content', ns)
            link_elem = entry.find('atom:link[@rel="alternate"]', ns)
            published_elem = entry.find('atom:published', ns)
            id_elem = entry.find('atom:id', ns)

            if title_elem is not None:
                title = title_elem.text
                content = content_elem.text if content_elem is not None else title

                # Extract plain text from HTML content
                if content:
                    content = re.sub('<[^<]+?>', '', content)
                    content = content.strip()

                link = link_elem.get('href') if link_elem is not None else ''
                published = published_elem.text if published_elem is not None else ''
                tool_id = id_elem.text if id_elem is not None else link

                tools.append({
                    'id': tool_id,
                    'name': title,
                    'tagline': content[:200] if content else title,
                    'description': content,
                    'url': link,
                    'votesCount': 0,
                    'createdAt': published,
                    'topics': []
                })

        return tools
    except Exception as e:
        print(f"[X] Atom feed fetch error: {e}")
        return []


def parse_producthunt_graphql(data):
    """Parse GraphQL response from ProductHunt API"""
    tools = []

    try:
        edges = data.get('data', {}).get('posts', {}).get('edges', [])

        for edge in edges:
            node = edge.get('node', {})
            topics = [t['node']['name'] for t in node.get('topics', {}).get('edges', [])]

            tools.append({
                'id': node.get('id', ''),
                'name': node.get('name', ''),
                'tagline': node.get('tagline', ''),
                'description': node.get('description', ''),
                'url': node.get('url', ''),
                'website': node.get('website', ''),
                'votesCount': node.get('votesCount', 0),
                'commentsCount': node.get('commentsCount', 0),
                'createdAt': node.get('createdAt', ''),
                'topics': topics
            })
    except Exception as e:
        print(f"[X] Error parsing GraphQL: {e}")

    return tools


def filter_marketing_tools(tools):
    """
    Keep only tools related to Marketing/E-commerce
    """
    filtered = []

    for tool in tools:
        text_to_check = (
            f"{tool.get('name', '')} {tool.get('tagline', '')} "
            f"{tool.get('description', '')} {' '.join(tool.get('topics', []))}"
        ).lower()

        if any(keyword in text_to_check for keyword in FILTER_KEYWORDS):
            filtered.append(tool)

    print(f"[OK] Filtered {len(filtered)}/{len(tools)} marketing/ecommerce tools")
    return filtered


def enrich_with_ai(tool):
    """
    Use local Ollama (DeepSeek) to generate marketing-focused summary
    """
    try:
        prompt = f"""Tu es un expert marketing. Réécris cette description en 2 phrases pour expliquer comment cet outil fait gagner de l'argent à un entrepreneur.

Outil: {tool['name']}
Description originale: {tool.get('description', tool.get('tagline', ''))}

Réponse (2 phrases max):"""

        payload = {
            "model": "deepseek-assistant:latest",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 100
            }
        }

        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)

        if response.status_code == 200:
            result = response.json()
            enriched_desc = result.get('response', '').strip()

            if enriched_desc:
                tool['ai_summary'] = enriched_desc
                print(f"  [+] Enriched: {tool['name'][:30]}...")
            else:
                tool['ai_summary'] = tool.get('tagline', '')
        else:
            print(f"  [!] Ollama API error for {tool['name']}: {response.status_code}")
            tool['ai_summary'] = tool.get('tagline', '')

    except requests.exceptions.ConnectionError:
        print(f"  [!] Ollama not running. Using original description for {tool['name']}")
        tool['ai_summary'] = tool.get('tagline', '')
    except Exception as e:
        print(f"  [!] AI enrichment error for {tool['name']}: {e}")
        tool['ai_summary'] = tool.get('tagline', '')

    return tool


def load_existing_tools():
    """Load existing tools to avoid duplicates"""
    if OUTPUT_FILE.exists():
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {tool['id']: tool for tool in data.get('tools', [])}
        except Exception as e:
            print(f"[!] Error loading existing tools: {e}")
    return {}


def save_tools(tools):
    """Save tools to JSON file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    output = {
        'last_updated': datetime.now().isoformat(),
        'total_tools': len(tools),
        'tools': tools
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n>> Saved {len(tools)} tools to {OUTPUT_FILE}")


def main():
    print(">> Starting AI Tools Scraper (Marketing/E-commerce Focus)\n")

    # Fetch data
    print(">> Fetching ProductHunt data...")
    raw_tools = fetch_producthunt_data()
    print(f">> Fetched {len(raw_tools)} tools")

    if not raw_tools:
        print(">> No tools fetched. Exiting.")
        return

    # Filter for marketing/ecommerce
    print("\n>> Filtering for marketing/e-commerce tools...")
    filtered_tools = filter_marketing_tools(raw_tools)

    if not filtered_tools:
        print(">> No marketing tools found in this batch")
        return

    # Load existing tools to merge
    print("\n>> Loading existing tools...")
    existing_tools = load_existing_tools()
    print(f">> Found {len(existing_tools)} existing tools")

    # Enrich with AI
    print("\n>> Enriching with AI summaries (via Ollama)...")
    enriched_tools = []

    for tool in filtered_tools:
        tool_id = tool.get('id', tool.get('url', ''))

        # Skip if already exists
        if tool_id in existing_tools:
            print(f"  >> Skipping existing: {tool['name']}")
            enriched_tools.append(existing_tools[tool_id])
        else:
            enriched_tool = enrich_with_ai(tool)
            enriched_tools.append(enriched_tool)

    # Merge with existing tools
    all_tools_dict = existing_tools.copy()
    for tool in enriched_tools:
        tool_id = tool.get('id', tool.get('url', ''))
        all_tools_dict[tool_id] = tool

    all_tools = list(all_tools_dict.values())

    # Sort by votes
    all_tools.sort(key=lambda x: x.get('votesCount', 0), reverse=True)

    # Save
    save_tools(all_tools)

    print("\n>> Scraper completed successfully!")
    print(f">> Total tools in database: {len(all_tools)}")


if __name__ == '__main__':
    main()
