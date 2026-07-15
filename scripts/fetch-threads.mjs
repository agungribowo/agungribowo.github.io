import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'public', 'data', 'threads.json')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } })

// Scroll profile to load all posts
await page.goto('https://www.threads.net/@agung.ribowo', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(4000)

// Scroll step by step to load all posts
let prevCount = 0
for (let pass = 0; pass < 8; pass++) {
  await page.evaluate(() => {
    const h = document.body.scrollHeight
    window.scrollTo(0, h)
  })
  await page.waitForTimeout(4000)
  const count = await page.evaluate(() => document.querySelectorAll('a[href*="/post/"]').length)
  console.log(`  pass ${pass + 1}: ${count} posts visible`)
  if (count === prevCount && pass > 1) break
  prevCount = count
}

// Collect all unique post URLs
const allPostUrls = await page.evaluate(() => {
  const seen = new Set()
  document.querySelectorAll('a[href*="/post/"]').forEach(a => {
    const h = a.getAttribute('href')
    if (h && !h.includes('/media')) seen.add(h.startsWith('http') ? h : 'https://www.threads.net' + h)
  })
  return [...seen]
})

console.log(`Found ${allPostUrls.length} total post links`)

// Visit each post page, extract data; dedup by image, fill rest by text
const withImg = []
const withoutImg = []
const seenImgs = new Set()
const seenTexts = new Set()

for (const url of allPostUrls) {
  if (withImg.length >= 6) break
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(2000)

    const data = await page.evaluate(() => {
      const text = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() || ''
      const img = [...document.querySelectorAll('img')].find(
        i => (i.width > 100 || i.height > 100) && !i.alt?.includes('profile')
      )
      return { text: text.slice(0, 600), image: img?.getAttribute('src') || '' }
    })

    if (data.text.length < 30) continue

    const tKey = data.text.replace(/\s+/g, ' ').slice(0, 100)
    if (seenTexts.has(tKey)) continue
    seenTexts.add(tKey)

    if (data.image) {
      const imgKey = data.image.split('?')[0]
      if (seenImgs.has(imgKey)) {
        withoutImg.push({ url, ...data })
        console.log(`  △ ${url.split('/post/')[1]} (dup img)`)
      } else {
        seenImgs.add(imgKey)
        withImg.push({ url, ...data })
        console.log(`  ✓ ${url.split('/post/')[1]} (img)`)
      }
    } else {
      withoutImg.push({ url, ...data })
      console.log(`  ✓ ${url.split('/post/')[1]} (text)`)
    }
  } catch (e) {
    console.log(`  ✗ ${url.split('/post/')[1]}`)
  }
}

await browser.close()

// Unique images first, then fill with text-only / duplicate-image entries
const threads = [...withImg, ...withoutImg].slice(0, 6)

const final = threads.map((item, i) => ({
  text: item.text,
  image: item.image || '',
  url: item.url,
  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
}))

writeFileSync(OUT, JSON.stringify(final, null, 2))
console.log(`\n✓ Saved ${final.length} threads`)
final.forEach(r => console.log(`  • ${r.text.replace(/\n/g, ' ').slice(0, 70)}...`))
