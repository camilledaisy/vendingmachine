import type { Item } from '../data/items'
import { catOf } from '../data/items'
import { artMarkup } from '../art/art'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function wrap(text: string, cols: number): string[] {
  const out: string[] = []
  let line = ''
  for (const w of text.split(/\s+/)) {
    if ((line + ' ' + w).trim().length > cols) {
      out.push(line)
      line = w
    } else line = (line + ' ' + w).trim()
  }
  if (line) out.push(line)
  return out
}

const lines = (ls: string[], x: number, y: number, lh: number, attrs: string) =>
  ls.map((l, i) => `<text x="${x}" y="${y + i * lh}" text-anchor="middle" ${attrs}>${esc(l)}</text>`).join('')

async function toDataUri(url: string): Promise<{ uri: string; w: number; h: number }> {
  const blob = await (await fetch(url)).blob()
  const uri = await new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = () => rej(r.error)
    r.readAsDataURL(blob)
  })
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = () => rej(new Error('image failed'))
    i.src = uri
  })
  return { uri, w: img.naturalWidth, h: img.naturalHeight }
}

export async function cardSvg(item: Item) {
  // Photos must be embedded as data URIs or the exported PNG would come out blank.
  let art = `<g transform="translate(175 138) scale(4.1)">${artMarkup(item.id)}</g>`
  if (item.image) {
    const { uri, w, h } = await toDataUri(item.image)
    const k = Math.min(400 / w, 480 / h)
    art = `<image href="${uri}" x="${300 - (w * k) / 2}" y="${363 - (h * k) / 2}" width="${w * k}" height="${h * k}"/>`
  }
  const cat = catOf(item.cat)
  const name = wrap(item.name, 20)
  const msg = wrap(item.message, 30)
  const desc = wrap(item.description, 52)
  const photo = !!item.image
  let y = 440
  const nameSvg = lines(name, 300, y, 40, 'font-family="Georgia,serif" font-size="34" font-weight="700" fill="#403B36"')
  y += name.length * 40 + 14
  const msgSvg = lines(msg, 300, y, 36, 'font-family="Georgia,serif" font-size="27" font-style="italic" fill="#403B36"')
  y += msg.length * 36 + 14
  const descSvg = lines(desc, 300, y, 24, 'font-family="Georgia,serif" font-size="17" fill="#5a534b"')
  y += desc.length * 24 + 30
  const h = photo ? 720 : Math.max(y + 60, 780)
  return {
    w: 600,
    h,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${h}" viewBox="0 0 600 ${h}">
<rect width="600" height="${h}" fill="#F5EEDF"/>
<rect x="14" y="14" width="572" height="${h - 28}" rx="18" fill="none" stroke="#914F4F" stroke-width="3" stroke-dasharray="10 6"/>
<text x="300" y="58" text-anchor="middle" font-family="Courier New,monospace" font-size="15" letter-spacing="3" fill="#914F4F">THE EMOTIONAL VENDING MACHINE</text>
<text x="300" y="84" text-anchor="middle" font-family="Courier New,monospace" font-size="14" fill="#403B36">${cat.code} · ${esc(cat.label)}</text>
<rect x="${photo ? 70 : 110}" y="108" width="${photo ? 460 : 380}" height="${photo ? 510 : 290}" rx="20" fill="#A3B18A" stroke="#403B36" stroke-width="3"/>
${art}
${photo ? '' : nameSvg + msgSvg + descSvg}
<text x="300" y="${h - 36}" text-anchor="middle" font-family="Courier New,monospace" font-size="15" fill="#914F4F">ITEM No. ${item.inv}</text>
</svg>`,
  }
}

export interface ReceiptLine {
  name: string
  inv: string
  code: string
}

export function receiptSvg(items: ReceiptLine[], when: Date) {
  const rule = '-'.repeat(30)
  const date = when.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  const rows: string[] = [
    '  FEELINGS & CO.',
    '  SELF-SERVICE DEPARTMENT',
    rule,
    date,
    'GUEST: anonymous (welcome)',
    rule,
  ]
  for (const it of items) {
    const [first, ...rest] = wrap(`1x ${it.name}`, 30)
    rows.push(first, ...rest.map((r) => '   ' + r), `   ${it.code} · No. ${it.inv}`)
  }
  rows.push(
    rule,
    `ITEMS RECEIVED: ${items.length}`,
    'SUBTOTAL: 0.00',
    'TAX: none',
    'TOTAL DUE: effort (waived)',
    rule,
    ...wrap('NO REFUNDS ON EXISTENTIAL REALIZATIONS.', 30),
    '',
    ...wrap('Thank you for visiting. I hope the rest of your day is at least moderately pleasant.', 30),
  )
  const lh = 21
  const h = 56 + rows.length * lh + 70
  const text = rows
    .map((r, i) => `<text x="30" y="${56 + i * lh}" xml:space="preserve" font-family="Courier New,monospace" font-size="15" fill="#403B36">${esc(r)}</text>`)
    .join('')
  let bars = ''
  let x = 40
  for (let i = 0; x < 300; i++) {
    const w = 1 + ((i * 7 + items.length) % 4)
    bars += `<rect x="${x}" y="${h - 56}" width="${w}" height="32" fill="#403B36"/>`
    x += w + 2 + (i % 3)
  }
  const zig = Array.from({ length: 17 }, (_, i) => `L${i * 20 + 10} ${i % 2 ? h - 10 : h}`).join(' ')
  return {
    w: 340,
    h,
    alt: rows.join('\n'),
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="${h}" viewBox="0 0 340 ${h}">
<path d="M0 0 H340 V${h} ${zig} L0 ${h}Z" fill="#FFFAF0"/>${text}${bars}</svg>`,
  }
}

export const svgUrl = (svg: string) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)

function toPng(svg: string, w: number, h: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = w * 2
      c.height = h * 2
      const g = c.getContext('2d')
      if (!g) return reject(new Error('no canvas'))
      g.drawImage(img, 0, 0, c.width, c.height)
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('no blob'))), 'image/png')
    }
    img.onerror = () => reject(new Error('image failed'))
    img.src = svgUrl(svg)
  })
}

export async function saveImage(img: { svg: string; w: number; h: number }, name: string) {
  const blob = await toPng(img.svg, img.w, img.h)
  const file = new File([blob], name, { type: 'image/png' })
  // On phones, offer the share sheet; elsewhere just download.
  if (matchMedia('(pointer:coarse)').matches && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
