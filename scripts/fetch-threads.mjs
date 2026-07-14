import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'src', 'data', 'threads.json')
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

function cleanText(raw) {
  // Remove username+metadata prefix: "agung.ribowoPC GAMING12hMore" or "agung.ribowomagisterjourney1dMore"
  let t = raw.replace(/^[a-z.]+\w{0,10}[A-Z][A-Za-z\s]*?\d+[hdmw]More/, '')
  // Split on next thread marker pattern
  const parts = t.split(/(?=[a-z.]+\w{0,10}[A-Z][A-Za-z\s]*?\d+[hdmw]More)/)
  t = parts[0]
  // Remove trailing engagement stats: "TranslateLike2Comment6RepostShare"
  t = t.replace(/(Audio is muted)?\s*Translate(Like\d+)?(Comment\d+)?(Repost\d+)?(Share\d+)?\s*$/, '')
  // Remove leftover "Like" patterns
  t = t.replace(/\s*(Like\d+|Comment\d+|Repost\d+|Share\d+)\s*$/, '')
  return t.trim()
}

const browser = await puppeteer.launch({
  executablePath: EDGE_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })

await page.goto('https://www.threads.net/@agung.ribowo', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 4000))

const result = await page.evaluate(() => {
  const links = [...new Set(
    Array.from(document.querySelectorAll('a[href*="/post/"]'))
      .map(a => a.getAttribute('href'))
      .filter(h => h && !h.includes('/media'))
      .map(h => h.startsWith('http') ? h : 'https://www.threads.net' + h)
  )]

  const uniqueTexts = new Set()
  Array.from(document.querySelectorAll('span')).forEach(el => {
    const t = el.textContent.trim()
    if (t.length < 60) return
    if (t.includes('cookie') || t.includes('AI Researcher')) return
    // Only take direct text (not deeply nested)
    uniqueTexts.add(t)
  })

  // Filter out substrings (keep longest version)
  const sorted = [...uniqueTexts].sort((a, b) => b.length - a.length)
  const filtered = sorted.filter((t, i) =>
    !sorted.slice(0, i).some(other => other.includes(t))
  )

  return { texts: filtered.slice(0, 10), links }
})

const { texts, links } = result

const cleaned = texts
  .map(t => cleanText(t))
  .filter(t => t.length >= 30)
  .filter((t, i, a) => !a.slice(0, i).some(o => o.includes(t) || t.includes(o)))
  .slice(0, 6)

const final = cleaned.map((text, i) => ({
  text,
  url: links[i * 2] || links[i] || 'https://www.threads.net/@agung.ribowo',
  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
}))

writeFileSync(OUT, JSON.stringify(final, null, 2))
console.log(`✓ Saved ${final.length} threads`)
final.forEach((r, i) => console.log(`  ${i + 1}. ${r.text.replace(/\n/g, ' ').slice(0, 80)}...`))

await browser.close()
