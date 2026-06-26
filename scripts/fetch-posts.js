#!/usr/bin/env node
// Eseguito da GitHub Actions prima di vite build.
// Fetch RSS Hashnode lato server (nessun CORS), salva public/posts.json
// con lo stesso schema usato da DataContext.jsx.

import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE  = join(__dirname, '..', 'public', 'posts.json')
const RSS_URL   = 'https://vlt.hashnode.dev/rss.xml'

const CONTENT_NS = 'content:encoded'

const getTag = (str, tag) =>
  str.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.trim() ?? ''

const stripCdata = str => str.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
const stripHtml  = str => str.replace(/<[^>]+>/g, '').trim()

const sanitizeHtml = html => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/\s+on\w+="[^"]*"/gi, '')
  .replace(/\s+on\w+='[^']*'/gi, '')
  .replace(/<a\b([^>]*)>/gi, (_, attrs) => {
    const clean = attrs
      .replace(/\s+target="[^"]*"/gi, '')
      .replace(/\s+rel="[^"]*"/gi, '')
    return `<a${clean} target="_blank" rel="noopener noreferrer">`
  })

const getAllMatches = (str, tag) =>
  [...str.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))]
    .map(m => m[1].trim())

let xml
try {
  const res = await fetch(RSS_URL, { headers: { Accept: 'application/rss+xml, text/xml, */*' }, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  xml = await res.text()
} catch (e) {
  console.warn(`[fetch-posts] fetch fallita: ${e.message}`)
  // Mantieni il posts.json esistente se disponibile — non interrompere il build
  if (existsSync(OUT_FILE)) {
    console.warn('[fetch-posts] uso cache esistente')
    process.exit(0)
  }
  writeFileSync(OUT_FILE, '[]', 'utf8')
  process.exit(0)
}

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m => m[1])

const posts = items.map(item => {
  const link  = stripCdata(getTag(item, 'link'))
  const slug  = link.split('/').filter(Boolean).at(-1) ?? ''
  const title = stripCdata(getTag(item, 'title'))
  const brief = stripHtml(stripCdata(getTag(item, 'description')))

  const contentRaw = item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] ?? null
  const content    = contentRaw ? sanitizeHtml(stripCdata(contentRaw)) : null

  const mediaMatch  = item.match(/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/i)
  const enclosureUrl = item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ?? null
  const coverUrl    = mediaMatch?.[1] ?? enclosureUrl ?? null

  const categories = getAllMatches(item, 'category').map(c => stripCdata(c)).filter(Boolean)

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

writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2), 'utf8')
console.log(`[fetch-posts] ✓ ${posts.length} articoli → public/posts.json`)
