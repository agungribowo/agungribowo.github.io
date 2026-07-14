import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'src', 'data', 'threads.json')
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const browser = await puppeteer.launch({
  executablePath: EDGE_PATH,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })

// Step 1: Scroll profile to load many posts
await page.goto('https://www.threads.net/@agung.ribowo', { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 4000))

await page.evaluate(async () => {
  await new Promise(resolve => {
    let h = 0
    const t = setInterval(() => { window.scrollBy(0, 500); h += 500; if (h > 6000) { clearInterval(t); resolve() } }, 400)
  })
})
await new Promise(r => setTimeout(r, 3000))

const postUrls = await page.evaluate(() => {
  const seen = new Set()
  document.querySelectorAll('a[href*="/post/"]').forEach(a => {
    const h = a.getAttribute('href')
    if (h && !h.includes('/media')) seen.add(h.startsWith('http') ? h : 'https://www.threads.net' + h)
  })
  return [...seen]
})

console.log(`Found ${postUrls.length} post URLs, fetching details...`)

// Step 2: Visit each post page for accurate image+text pairing
const threads = []
for (const url of postUrls) {
  if (threads.length >= 6) break
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 })
    await new Promise(r => setTimeout(r, 2000))

    const data = await page.evaluate(() => {
      const img = [...document.querySelectorAll('img')].find(i => (i.width > 100 || i.height > 100) && !i.alt?.includes('profile'))
      let text = ''
      document.querySelectorAll('span').forEach(sp => {
        const t = sp.textContent.trim()
        if (t.length > text.length) text = t
      })
      return { image: img?.getAttribute('src') || '', text: text.slice(0, 600) }
    })

    if (data.text.length < 30) continue

    // Deduplicate: skip if same text content as existing
    const isDup = threads.some(t => {
      const a = t.text.replace(/\s+/g, ' ').slice(0, 80)
      const b = data.text.replace(/\s+/g, ' ').slice(0, 80)
      return a === b
    })
    if (isDup) continue

    threads.push({ url, ...data })
    console.log(`  ✓ ${url.split('/post/')[1]}`)
  } catch (e) {
    console.log(`  ✗ ${url.split('/post/')[1]}: ${e.message}`)
  }
}

await browser.close()

const final = threads.map((item, i) => ({
  text: item.text,
  image: item.image || '',
  url: item.url,
  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
}))

writeFileSync(OUT, JSON.stringify(final, null, 2))
console.log(`\n✓ Saved ${final.length} threads`)
