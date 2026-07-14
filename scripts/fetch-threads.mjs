import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'src', 'data', 'threads.json')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

// Scroll profile to load all posts
await page.goto('https://www.threads.net/@agung.ribowo', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(4000)

await page.evaluate(async () => {
  await new Promise(resolve => {
    let h = 0
    const t = setInterval(() => { window.scrollBy(0, 600); h += 600; if (h > 12000) { clearInterval(t); resolve() } }, 400)
  })
})
await page.waitForTimeout(3000)

const postUrls = await page.evaluate(() => {
  const seen = new Set()
  document.querySelectorAll('a[href*="/post/"]').forEach(a => {
    const h = a.getAttribute('href')
    if (h && !h.includes('/media')) seen.add(h.startsWith('http') ? h : 'https://www.threads.net' + h)
  })
  return [...seen]
})

console.log(`Found ${postUrls.length} posts, fetching details...`)

// Visit each post page, extract og:description (main post) + image
const threads = []
const seenImgPaths = new Set()

for (const url of postUrls) {
  if (threads.length >= 6) break
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(2000)

    const data = await page.evaluate(() => {
      const text = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() || ''
      const img = [...document.querySelectorAll('img')].find(
        i => (i.width > 100 || i.height > 100) && !i.alt?.includes('profile')
      )
      const imgSrc = img?.getAttribute('src') || ''
      const imgBase = imgSrc.split('?')[0] || imgSrc
      return { text: text.slice(0, 600), image: imgSrc, imgBase }
    })

    if (data.text.length < 30) continue

    if (data.imgBase && seenImgPaths.has(data.imgBase)) continue
    if (data.imgBase) seenImgPaths.add(data.imgBase)

    const isTextDup = threads.some(t => t.text.slice(0, 80) === data.text.slice(0, 80))
    if (isTextDup) continue

    threads.push({ url, text: data.text, image: data.image })
    console.log(`  ✓ ${url.split('/post/')[1]}`)
  } catch (e) {
    console.log(`  ✗ ${url.split('/post/')[1]}`)
  }
}

await browser.close()

const final = threads.slice(0, 6).map((item, i) => ({
  text: item.text,
  image: item.image || '',
  url: item.url,
  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
}))

writeFileSync(OUT, JSON.stringify(final, null, 2))
console.log(`\n✓ Saved ${final.length} threads`)
final.forEach(r => console.log(`  • ${r.text.replace(/\n/g, ' ').slice(0, 70)}...`))
