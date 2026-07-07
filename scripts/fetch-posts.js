// Fetch RSS Hashnode — usato da GitHub Actions prima del deploy.
// Prima prova HTTP normale; se Vercel risponde con challenge, usa Playwright
// per leggere rss.xml come farebbe un browser.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))

const RSS_URL   = 'https://vlt.hashnode.dev/rss.xml'
const CACHE_DIR = join(tmpdir(), 'vlt-dev-cache')
const OUT_FILE  = process.env.CI === 'true'
  ? join(__dirname, '..', 'public', 'posts.json')
  : join(CACHE_DIR, 'posts.json')
const USER_AGENT = 'Mozilla/5.0 (compatible; vlt-website/0.1.3; +https://lorenzoveronesi.it)'

// ── RSS parser (regex — no DOMParser in Node.js) ──────────────────────────

const getTag = (str, tag) =>
  str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.trim() ?? ''

const stripCdata = s => s.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
const stripHtml  = s => s.replace(/<[^>]+>/g, '').trim()

const getAllTags = (str, tag) =>
  [...str.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map(m => m[1].trim())

const parseXml = xml => {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m => m[1])
  return items.map(item => {
    const link  = stripCdata(getTag(item, 'link'))
    const slug  = link.split('/').filter(Boolean).at(-1) ?? ''
    const title = stripCdata(getTag(item, 'title'))
    const brief = stripHtml(stripCdata(getTag(item, 'description')))
    const contentRaw = item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] ?? null
    const content    = contentRaw ? stripCdata(contentRaw) : null
    const mediaMatch   = item.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i)
    const enclosureUrl = item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ?? null
    const coverUrl     = mediaMatch?.[1] ?? enclosureUrl ?? null
    const categories   = getAllTags(item, 'category').map(stripCdata).filter(Boolean)
    return {
      id:                stripCdata(getTag(item, 'guid')) || slug,
      title,
      brief,
      content,
      slug,
      coverImage:        coverUrl ? { url: coverUrl } : null,
      publishedAt:       getTag(item, 'pubDate'),
      readTimeInMinutes: Math.max(1, Math.ceil(brief.split(/\s+/).length / 200)),
      tags:              categories.map(name => ({ name })),
    }
  }).filter(p => p.slug)
}

// ── Fetch ──────────────────────────────────────────────────────────────────

const assertXml = text => {
  if (!text.includes('<rss') && !text.includes('<?xml'))
    throw new Error('risposta non XML — Vercel challenge attivo')
  return text
}

const fetchRssHttp = async () => {
  const res = await fetch(RSS_URL, {
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`)
  return assertXml(await res.text())
}

const fetchRssBrowser = async () => {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  })

  try {
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'it-IT',
      viewport: { width: 1440, height: 1000 },
    })
    const page = await context.newPage()
    await page.goto(RSS_URL, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(20000)
    const text = await page.locator('body').innerText().catch(() => page.content())
    return assertXml(text)
  } finally {
    await browser.close()
  }
}

const readPrevPosts = () => {
  try {
    const data = JSON.parse(readFileSync(OUT_FILE, 'utf8'))
    return Array.isArray(data) ? data : (data.posts ?? [])
  } catch {
    return []
  }
}

export async function generatePostsPayload() {
  let text
  try {
    text = await fetchRssHttp()
    console.log('[fetch-posts] RSS via HTTP')
  } catch (e) {
    console.warn(`[fetch-posts] HTTP fallito: ${e.message}`)
    text = await fetchRssBrowser()
    console.log('[fetch-posts] RSS via Playwright')
  }

  const freshPosts = parseXml(text)
  if (!freshPosts.length) throw new Error('nessun articolo nel feed')

  // Il feed RSS espone solo gli articoli più recenti: senza merge, quelli più
  // vecchi "scorrerebbero fuori" dalla finestra del feed e sparirebbero dal
  // sito. Uniamo i fresh (autoritativi) con quelli precedenti non più presenti.
  const prevPosts = readPrevPosts()
  const freshIds  = new Set(freshPosts.map(p => p.id))
  const carriedOver = prevPosts.filter(p => !freshIds.has(p.id))
  const posts = [...freshPosts, ...carriedOver]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  return { posts }
}

// ── Entry point CLI / CI ───────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    if (process.env.CI !== 'true') mkdirSync(CACHE_DIR, { recursive: true })
    const { posts } = await generatePostsPayload()
    writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2), 'utf8')
    console.log(`[fetch-posts] ✓ ${posts.length} articoli → ${OUT_FILE}`)
  } catch (e) {
    console.warn(`[fetch-posts] fallito: ${e.message}`)
    if (existsSync(OUT_FILE)) {
      console.warn('[fetch-posts] uso posts.json dalla cache del run precedente')
      process.exit(0)
    }
    process.exit(1)
  }
}
