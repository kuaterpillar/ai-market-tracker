# AI Marketing Tools Tracker

An automated Market Intelligence Dashboard that tracks and curates the latest AI-powered marketing and e-commerce tools. Built with **Next.js 14** (frontend) and **Python** (data pipeline), this project automatically updates daily via GitHub Actions and deploys to Vercel.

## Features

- **Automated Data Scraping**: Daily scraping of ProductHunt for new marketing/e-commerce AI tools
- **AI-Powered Summaries**: Uses local Ollama (DeepSeek) to generate business-focused tool descriptions
- **SEO-Optimized**: Individual pages for each tool with proper metadata
- **Dark Mode Design**: Modern SaaS aesthetic with Tailwind CSS
- **Zero-Touch Operation**: Fully automated via GitHub Actions (Fire & Forget)
- **Static Site Generation**: Fast, SEO-friendly static pages deployed on Vercel

## Architecture

```
┌─────────────────────────────────────────────┐
│  GitHub Actions (Daily 6am UTC)             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Python Scraper (backend/scraper.py)        │
│  ├─ Fetch ProductHunt API/RSS               │
│  ├─ Filter: Marketing/E-commerce keywords   │
│  ├─ Enrich: Ollama AI summaries             │
│  └─ Output: data/tools.json                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Next.js 14 (Static Site Generation)        │
│  ├─ Homepage: Tools grid                    │
│  ├─ Dynamic: /tool/[slug] pages             │
│  └─ Build: Static HTML export               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Vercel (Auto-deploy on git push)           │
└─────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- **Node.js** 18+ (for Next.js)
- **Python** 3.11+ (for scraper)
- **Ollama** (optional, for AI summaries) - [Install here](https://ollama.ai)
  - Run: `ollama pull deepseek-r1:1.5b`

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd newprojetc\ argent\ ia
   ```

2. **Install dependencies**
   ```bash
   # Python dependencies
   pip install -r requirements.txt

   # Node.js dependencies
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your ProductHunt API credentials (or leave empty to use RSS feed):
   ```
   PRODUCTHUNT_API_KEY=your_key_here
   PRODUCTHUNT_API_SECRET=your_secret_here
   ```

   Get API keys at: https://www.producthunt.com/v2/oauth/applications

4. **Start Ollama** (optional, for AI summaries)
   ```bash
   ollama serve
   ```

   In another terminal:
   ```bash
   ollama pull deepseek-r1:1.5b
   ```

### Usage

#### Run the Scraper Manually

```bash
python backend/scraper.py
```

This will:
- Fetch the latest tools from ProductHunt
- Filter for marketing/e-commerce tools
- Generate AI summaries (if Ollama is running)
- Save results to `data/tools.json`

#### Run the Website Locally

```bash
npm run dev
```

Visit: http://localhost:3000

#### Build for Production

```bash
npm run build
```

This generates a static site in the `out/` directory.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Deploy!

3. **Set up GitHub Secrets** (for automated updates)

   Go to your GitHub repo → Settings → Secrets and variables → Actions

   Add these secrets (optional):
   - `PRODUCTHUNT_API_KEY`
   - `PRODUCTHUNT_API_SECRET`

4. **Enable GitHub Actions**

   The workflow at `.github/workflows/daily-update.yml` will:
   - Run daily at 6 AM UTC
   - Scrape new tools
   - Commit changes to `data/tools.json`
   - Trigger automatic Vercel redeployment

### Manual Workflow Trigger

You can manually trigger the scraper workflow:

1. Go to your GitHub repo
2. Click "Actions" tab
3. Select "Daily AI Tools Update"
4. Click "Run workflow"

## Project Structure

```
.
├── backend/
│   └── scraper.py           # Python scraper script
├── data/
│   └── tools.json           # Generated tools database
├── src/
│   └── app/
│       ├── page.tsx         # Homepage (tools grid)
│       ├── layout.tsx       # Root layout
│       ├── globals.css      # Global styles
│       └── tool/
│           └── [slug]/
│               └── page.tsx # Individual tool pages
├── .github/
│   └── workflows/
│       └── daily-update.yml # GitHub Actions automation
├── package.json             # Node.js dependencies
├── requirements.txt         # Python dependencies
├── next.config.ts           # Next.js config (static export)
├── tailwind.config.ts       # Tailwind CSS config
└── README.md                # This file
```

## Customization

### Change Niche Keywords

Edit `backend/scraper.py` and modify the `FILTER_KEYWORDS` list:

```python
FILTER_KEYWORDS = [
    'marketing', 'seo', 'analytics', 'e-commerce',
    # Add your own keywords here
]
```

### Adjust AI Prompt

Edit the prompt in `backend/scraper.py` → `enrich_with_ai()` function:

```python
prompt = f"""Your custom prompt here..."""
```

### Change Update Frequency

Edit `.github/workflows/daily-update.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # Change this (format: minute hour day month weekday)
```

Examples:
- Every 6 hours: `'0 */6 * * *'`
- Twice daily (6am & 6pm): `'0 6,18 * * *'`
- Weekly (Monday 6am): `'0 6 * * 1'`

## Monetization Ideas

1. **Affiliate Links**: Add affiliate tracking to tool URLs
2. **Sponsored Listings**: Premium placement for featured tools
3. **Newsletter**: Export tools to email subscribers
4. **API Access**: Sell access to your curated data
5. **Premium Filters**: Paid access to advanced filtering

## Troubleshooting

### Scraper Issues

**No tools found?**
- Check your filter keywords are not too restrictive
- Verify ProductHunt API/RSS is accessible
- Check logs: `python backend/scraper.py`

**Ollama not working?**
- Ensure Ollama is running: `ollama serve`
- Check model is downloaded: `ollama list`
- Scraper will fallback to original descriptions if Ollama fails

### Next.js Issues

**Build fails?**
- Ensure `data/tools.json` exists (run scraper first)
- Check Node.js version: `node -v` (needs 18+)

**Vercel deployment fails?**
- Check build logs in Vercel dashboard
- Ensure `data/tools.json` is committed to git

### GitHub Actions Issues

**Workflow not running?**
- Check Actions are enabled in repo settings
- Verify workflow syntax is valid
- Check workflow run logs in Actions tab

## 💰 Monetization

**Want to make passive income with this project?** Check out the complete monetization guide:

👉 **[MONETIZATION.md](./MONETIZATION.md)** - Step-by-step guide to turn this into a money-making machine

Features included:
- ✅ Automatic affiliate link tracking
- ✅ Google Analytics integration
- ✅ SEO optimization (sitemap, robots.txt, meta tags)
- ✅ Daily auto-updates via GitHub Actions
- ✅ Zero-touch operation

**Estimated Setup Time**: 45 minutes
**Estimated Revenue**: $500-5000/month (after 6-12 months of organic growth)

### Quick Start for Monetization

1. **Deploy to Vercel** (10 min)
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   # Then import on vercel.com
   ```

2. **Add Google Analytics** (5 min)
   - Create GA4 property at https://analytics.google.com
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel environment variables

3. **Join Affiliate Programs** (15 min)
   - Impact Partnership Cloud: https://impact.com
   - ShareASale: https://www.shareasale.com
   - AppSumo Partners: https://partners.appsumo.com

4. **Submit to Google** (5 min)
   - Add site to Google Search Console
   - Submit sitemap: `https://yoursite.com/sitemap.xml`

**That's it!** Your site will now:
- Scrape new tools daily
- Auto-deploy updates
- Generate SEO pages
- Track affiliate clicks
- Earn passive income

## License

MIT License - Feel free to use for your own projects!

## Contributing

Pull requests welcome! Some ideas:
- Add more data sources (HackerNews, Reddit, etc.)
- Implement category filtering
- Add search functionality
- Create comparison features
- Build email newsletter integration

---

**Built with**: Next.js 14 • Python 3.11 • Tailwind CSS • Ollama • GitHub Actions • Vercel

**💡 Pro Tip**: Read [MONETIZATION.md](./MONETIZATION.md) to learn how to turn this into a passive income stream!
