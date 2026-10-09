// Hand-drawn (ish) SVG illustrations, 64x64, keyed by item id.
// The wrapper in ObjectArt supplies the ink outline: stroke #403B36, width 2, round joins.
// Every shape sets its own fill; use L() for open lines.

const K = '#403B36'
const C = '#F5EEDF'
const W = '#FFFAF0'
const G = '#A3B18A'
const R = '#D4A5A5'
const Y = '#F2D98D'
const B = '#914F4F'
const GREEN = '#6F8560'

const P = (d: string, f: string, x = '') => `<path d="${d}" fill="${f}" ${x}/>`
const L = (d: string, x = '') => `<path d="${d}" fill="none" ${x}/>`
const E = (cx: number, cy: number, rx: number, ry: number, f: string, x = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`
const O = (cx: number, cy: number, r: number, f: string, x = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${x}/>`
const Rt = (x: number, y: number, w: number, h: number, f: string, r = 2, e = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${e}/>`
const D = (cx: number, cy: number, r = 1.5) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${K}" stroke="none"/>`
const T = (x: number, y: number, s: number, t: string, f = K, font = 'Courier New,monospace') =>
  `<text x="${x}" y="${y}" font-size="${s}" font-family="${font}" font-weight="700" fill="${f}" stroke="none" text-anchor="middle">${t}</text>`
const G_ = (t: string, inner: string) => `<g transform="${t}">${inner}</g>`
const bt = (cx: number, cy: number, r: number, f: string, four: boolean) =>
  O(cx, cy, r, f) + O(cx, cy, r * 0.62, 'none', 'stroke-width="1" opacity=".45"') +
  (four ? D(cx - r / 4, cy - r / 4, 1) + D(cx + r / 4, cy - r / 4, 1) + D(cx - r / 4, cy + r / 4, 1) + D(cx + r / 4, cy + r / 4, 1) : D(cx - r / 4, cy, 1) + D(cx + r / 4, cy, 1))
const waves = (y: number) => L(`M2 ${y} Q8 ${y - 4} 14 ${y} T26 ${y} T38 ${y} T50 ${y} T62 ${y}`, `stroke="${GREEN}"`)

export const ART: Record<string, string> = {
  // the mystery parcel handed out by F06
  parcel:
    Rt(8, 18, 48, 38, '#C9A56B', 3) + L('M8 30 H56', 'stroke-width="1.2" opacity=".35"') +
    L('M32 18 V56 M8 37 H56', `stroke="${B}" stroke-width="2.5"`) +
    P('M32 18 Q22 6 18 14 Q18 22 32 18 Q46 22 46 14 Q42 6 32 18Z', R, 'stroke-width="1.8"') +
    Rt(40, 40, 12, 9, C, 1, 'stroke-width="1.4"') + T(46, 47, 6, '?'),

  // A
  star:
    P('M32 5 L39 23 L58 24 L43 36 L48 56 L32 45 L16 56 L21 37 L6 25 L25 23Z', Y) +
    L('M32 5 V45 M6 25 L43 36 M58 24 L21 37', 'stroke-width="1" opacity=".4"'),
  umbrella:
    L('M32 8 V4') +
    P('M7 34 Q32 -2 57 34 Q49 28 41 34 Q32 27 23 34 Q15 28 7 34Z', R) +
    L('M32 8 Q25 20 23 34 M32 8 Q39 20 41 34', 'stroke-width="1.2" opacity=".45"') +
    L('M32 34 V52 Q32 59 39 57') +
    L('M10 10 v4 M54 12 v4 M48 3 v4', `stroke="${GREEN}"`),
  jar:
    Rt(20, 9, 24, 9, B, 2) +
    P('M17 24 Q17 18 23 18 H41 Q47 18 47 24 V51 Q47 57 41 57 H23 Q17 57 17 51Z', W, 'fill-opacity=".7"') +
    P('M18 38 Q25 34 32 38 T46 38 V51 Q46 56 41 56 H23 Q18 56 18 51Z', G, 'stroke="none"') +
    Rt(23, 25, 18, 10, C, 1.5) +
    L('M26 30 q2 -3 4 0 t4 0', 'stroke-width="1.2"'),
  nightlight:
    Rt(12, 6, 40, 48, C, 7) +
    O(32, 26, 14, Y, 'fill-opacity=".35" stroke="none"') +
    O(32, 26, 9, Y) +
    L('M29 31 L30 36 L34 36 L35 31', 'stroke-width="1.2"') +
    Rt(27, 41, 3, 6, K, 0.5, 'stroke="none"') + Rt(34, 41, 3, 6, K, 0.5, 'stroke="none"') +
    Rt(24, 54, 5, 6, G, 1) + Rt(35, 54, 5, 6, G, 1),
  sock:
    P('M22 6 H40 V30 L53 38 Q60 45 53 53 Q46 58 38 52 L22 40Z', G) +
    Rt(22, 6, 18, 9, R, 1.5) +
    L('M22 22 H40 M22 29 H40', 'stroke-width="1.5" opacity=".45"') +
    L('M45 44 l5 5 M50 44 l-5 5', 'stroke-width="1.5"'),
  bandage: G_(
    'rotate(-28 32 32)',
    Rt(5, 22, 54, 20, R, 10) + Rt(23, 22, 18, 20, C, 1) + D(28, 28, 1) + D(36, 28, 1) + D(28, 36, 1) + D(36, 36, 1) +
      D(12, 29, 1) + D(12, 35, 1) + D(52, 29, 1) + D(52, 35, 1),
  ),

  // C
  key: G_(
    'rotate(30 32 32)',
    P('M5 32 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M11 32 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0Z', Y, 'fill-rule="evenodd"') +
      Rt(24, 29, 33, 6, Y, 2) + Rt(48, 35, 5, 9, Y, 1) + Rt(39, 35, 5, 7, Y, 1),
  ),
  ticket: G_(
    'rotate(-6 32 32)',
    P('M6 16 H58 V27 A5 5 0 0 0 58 37 V48 H6 V37 A5 5 0 0 0 6 27Z', R) +
      L('M44 18 V46', 'stroke-dasharray="2 3" stroke-width="1.5"') +
      T(25, 29, 8, 'ADMIT') + T(25, 39, 8, 'ONE') +
      P('M51 24 l2 5 5 .5 -4 3 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -3 5 -.5Z', Y, 'stroke-width="1"'),
  ),
  seed:
    Rt(14, 8, 36, 48, G, 2) + L('M14 15 H50', 'stroke-dasharray="3 2"') +
    O(32, 36, 12, C) + L('M32 46 V34') +
    P('M32 37 Q24 37 24 30 Q31 30 32 37Z', G, 'stroke-width="1.5"') + P('M32 41 Q40 41 40 34 Q33 34 32 41Z', G, 'stroke-width="1.5"') +
    E(53, 59, 3, 1.8, '#8B6B4A', 'stroke-width="1"'),
  postcard: G_(
    'rotate(4 32 32)',
    Rt(6, 14, 52, 36, C, 2) + Rt(10, 18, 24, 28, '#B9C6A0', 1) + O(22, 27, 5, Y) +
      P('M10 46 V38 Q18 30 24 38 T34 36 V46Z', '#8A9A6F', 'stroke-width="1.2"') +
      L('M38 25 H52 M38 31 H52 M38 37 H48', 'stroke-width="1.2" opacity=".55"') +
      Rt(46, 17, 8, 7, R, 1, 'stroke-width="1.4"'),
  ),
  boat:
    P('M5 36 H59 L49 50 H15Z', C) + P('M32 6 L50 34 H32Z', R) + P('M31 14 L15 34 H31Z', C) + L('M32 6 V36') + waves(57),
  bakery:
    L('M26 4 q-3 3 0 6 t0 6 M38 4 q-3 3 0 6 t0 6', 'stroke-width="1.5" opacity=".45"') +
    P('M15 24 H49 L53 58 H11Z', '#E6D3AD') + P('M13 17 H51 V25 H13Z', '#D9C49A') + L('M13 21 H51', 'stroke-dasharray="2 2" stroke-width="1.2"') +
    O(32, 42, 8, R, 'stroke-width="1.5"') +
    P('M32 47 l-5 -5 q-2 -4 2 -5 q3 0 3 3 q0 -3 3 -3 q4 1 2 5Z', B, 'stroke-width="1"'),

  // D
  receipt:
    P('M14 4 H50 V58 L46 54 L42 58 L38 54 L34 58 L30 54 L26 58 L22 54 L18 58 L14 54Z', W) +
    L('M20 12 H44', 'stroke-width="3"') +
    L('M20 20 H44 M20 26 H44 M20 32 H38', 'stroke-width="1.2" opacity=".5"') +
    L('M20 39 H44', 'stroke-dasharray="2 2" stroke-width="1.2"') +
    T(32, 49, 7, 'EFFORT'),
  teacup:
    L('M22 12 q-3 4 0 8 M32 8 q-3 4 0 8', 'stroke-width="1.5" opacity=".45"') +
    E(30, 54, 25, 5, '#E9DFC8') +
    L('M48 28 Q60 27 58 37 Q56 45 47 43') +
    P('M11 24 H48 V37 Q48 51 29.5 51 Q11 51 11 37Z', C) +
    L('M24 24 L29 33 L23 39 L30 51', 'stroke="#C9972E" stroke-width="3"'),
  letter:
    Rt(7, 16, 50, 34, C, 2) + L('M7 17 L32 36 L57 17') +
    Rt(44, 38, 9, 8, 'none', 1, 'stroke-dasharray="2 2" stroke-width="1.2"') +
    L('M12 44 H28', 'stroke-width="1.2" opacity=".5"'),
  cloud:
    P('M17 42 Q6 42 6 34 Q6 26 16 26 Q17 14 31 14 Q44 14 46 26 Q58 26 58 34 Q58 42 48 42Z', '#CBD3D4') +
    D(26, 29, 1.7) + D(38, 29, 1.7) + L('M28 37 Q32 34 36 37', 'stroke-width="1.5"') +
    L('M20 48 v5 M32 47 v8 M44 48 v5', 'stroke="#6F8F96" stroke-width="2"'),
  chair:
    Rt(17, 6, 30, 26, R, 4) + L('M23 12 V28 M32 12 V28 M41 12 V28', 'stroke-width="1.2" opacity=".45"') +
    Rt(13, 32, 38, 8, B, 3) + Rt(16, 40, 5, 18, B, 1) + Rt(43, 40, 5, 18, B, 1) + L('M21 49 H43', 'stroke-width="2"'),
  sticky: G_(
    'rotate(-5 32 32)',
    P('M10 10 H54 V44 L44 54 H10Z', Y) + P('M44 54 V44 H54Z', '#D9BE6A', 'stroke-width="1.5"') +
      T(32, 38, 20, 'Same.', K, 'Caveat,cursive'),
  ),

  // E
  maze:
    Rt(8, 8, 48, 48, C, 2) +
    L('M8 20 H34 M22 8 V32 M46 8 V28 H34 M34 28 V44 M20 44 H46 M20 32 V44 M46 36 H56 M8 36 H12 M12 36 V52', 'stroke-width="1.6"') +
    O(14, 14, 3, G) + L('M50 50 V41') + P('M50 41 L56 44 L50 47Z', B, 'stroke-width="1"'),
  buttons:
    L('M32 42 q10 10 19 5', `stroke="${B}" stroke-width="1"`) +
    bt(20, 22, 10, R, true) + bt(43, 19, 8, G, false) + bt(32, 42, 11, Y, true) + bt(13, 47, 7, B, false) + bt(51, 49, 8, C, true),
  moon:
    O(32, 34, 22, '#F4EBC8') + O(24, 26, 5, '#E5D9AE', 'stroke-width="1.2"') + O(40, 38, 7, '#E5D9AE', 'stroke-width="1.2"') + O(27, 46, 3, '#E5D9AE', 'stroke-width="1.2"') +
    O(32, 6, 3, 'none') + L('M32 9 V12') +
    L('M8 14 h4 M10 12 v4 M54 10 h4 M56 8 v4 M54 54 h3', 'stroke-width="1.4"'),
  fortune:
    P('M12 12 H52 L32 32Z', R) + P('M52 12 V52 L32 32Z', G) + P('M12 52 H52 L32 32Z', Y) + P('M12 12 V52 L32 32Z', '#B9C6A0') +
    L('M12 12 L52 52 M52 12 L12 52', 'stroke-width="1" opacity=".45"') +
    T(32, 22, 7, '1') + T(44, 35, 7, '2') + T(32, 48, 7, '3') + T(20, 35, 7, '4'),
  snail: G_('translate(64 0) scale(-1 1)',
    P('M5 54 Q6 42 18 44 L30 46 Q56 46 58 54 Q58 56 54 56 H8 Q5 56 5 54Z', G) +
    L('M10 44 L7 32 M16 43 L16 30') + O(7, 31, 2, G, 'stroke-width="1.5"') + O(16, 29, 2, G, 'stroke-width="1.5"') +
    O(40, 28, 17, Y) +
    L('M40 28 a2 2 0 0 1 3 2 a5 5 0 0 1 -8 1 a9 9 0 0 1 12 -10 a13 13 0 0 1 6 15', 'stroke-width="1.5"') +
    D(12, 50, 1.3)),
  marble:
    O(32, 32, 22, G) +
    L('M13 38 Q30 22 51 36', `stroke="${C}" stroke-width="3"`) + L('M17 47 Q32 36 46 48', `stroke="${Y}" stroke-width="3"`) +
    E(23, 21, 6, 3.5, '#fff', 'transform="rotate(-35 23 21)" stroke="none" opacity=".7"'),


  // E (new games)
  soup:
    L('M24 8 q-3 3 0 6 t0 6 M36 6 q-3 3 0 6 t0 6', 'stroke-width="1.5" opacity=".45"') +
    P('M7 28 H57 Q55 52 32 52 Q9 52 7 28Z', R) + E(32, 28, 25, 6, Y) +
    T(20, 30, 8, 'A') + T(31, 32, 8, 'B') + T(43, 29, 8, 'Z') + T(26, 25, 7, 'K') + T(38, 24, 7, 'M') +
    Rt(21, 52, 22, 5, B, 1.5),
  wordtiles:
    G_('rotate(-6 32 32)', Rt(4, 22, 13, 16, G, 2) + Rt(19, 22, 13, 16, Y, 2) + Rt(34, 22, 13, 16, C, 2) + Rt(49, 22, 11, 16, R, 2) +
      T(10.5, 34, 11, 'W') + T(25.5, 34, 11, 'O') + T(40.5, 34, 11, 'R') + T(54.5, 34, 11, 'D')) +
    L('M12 46 H52', 'stroke-width="1.2" opacity=".35" stroke-dasharray="2 3"'),
  sliding:
    Rt(6, 6, 52, 52, B, 4) +
    Rt(10, 10, 14, 14, C, 1.5) + Rt(25, 10, 14, 14, G, 1.5) + Rt(40, 10, 14, 14, Y, 1.5) +
    Rt(10, 25, 14, 14, R, 1.5) + Rt(25, 25, 14, 14, C, 1.5) + Rt(40, 25, 14, 14, G, 1.5) +
    Rt(10, 40, 14, 14, Y, 1.5) + Rt(25, 40, 14, 14, R, 1.5),
  bubbles:
    Rt(6, 8, 52, 48, '#E4EEEE', 4, 'fill-opacity=".85"') +
    [16, 32, 48].map((x) => [20, 32, 44].map((y) => O(x, y, 6, '#F6FBFB') + L(`M${x - 3} ${y - 1} Q${x - 2} ${y - 4} ${x + 1} ${y - 4}`, 'stroke-width="1.2" opacity=".6"')).join('')).join(''),
  bells:
    P('M22 8 Q10 12 10 32 L6 40 H38 L34 32 Q34 12 22 8Z',Y) + O(22,44,3.5,K,'stroke="none"') + L('M22 8 V4') +
    P('M44 8 Q32 12 32 32 L28 40 H60 L56 32 Q56 12 44 8Z',R) + O(44,44,3.5,K,'stroke="none"') + L('M44 8 V4') ,
  noughts:
    Rt(6, 6, 52, 52, C, 3) + L('M24 10 V54 M40 10 V54 M10 24 H54 M10 40 H54', 'stroke-width="2.2"') +
    L('M13 13 L21 21 M21 13 L13 21', `stroke="${B}" stroke-width="2.5"`) + O(32, 32, 5, 'none', `stroke="${GREEN}" stroke-width="2.5"`) +
    L('M43 43 L51 51 M51 43 L43 51', `stroke="${B}" stroke-width="2.5"`) + O(48, 16, 5, 'none', `stroke="${GREEN}" stroke-width="2.5"`),

  // F
  permission:
    Rt(10, 6, 44, 52, W, 2) + Rt(10, 6, 44, 11, B, 2) + T(32, 14.5, 6.5, 'PERMIT', C) +
    L('M16 24 H48 M16 30 H48 M16 36 H40', 'stroke-width="1.2" opacity=".5"') +
    O(42, 48, 7, 'none', `stroke="${B}" stroke-width="1.6"`) + T(42, 50.5, 6.5, 'OK', B) +
    L('M15 51 q4 -6 8 0 t8 -1', 'stroke-width="1.4"'),
  jar2:
    Rt(18, 9, 28, 8, '#C9A56B', 2) +
    P('M14 23 Q14 17 20 17 H44 Q50 17 50 23 V50 Q50 57 43 57 H21 Q14 57 14 50Z', W, 'fill-opacity=".65"') +
    Rt(21, 27, 22, 17, C, 1) + T(32, 40, 14, '?') +
    O(21, 51, 1.8, Y, 'stroke-width=".8"') + O(30, 52, 1.8, G, 'stroke-width=".8"') + O(41, 50, 1.8, R, 'stroke-width=".8"') + O(38, 22, 1.8, Y, 'stroke-width=".8"'),
  compass:
    O(32, 32, 25, Y) + O(32, 32, 19, C) +
    L('M32 8 v3 M32 53 v3 M8 32 h3 M53 32 h3') +
    G_('rotate(125 32 32)', P('M32 14 L37 32 L27 32Z', R) + P('M32 50 L37 32 L27 32Z', G)) +
    O(32, 32, 2.4, K) + T(32, 25, 6, 'N'),
  door:
    Rt(15, 6, 34, 52, Y, 1) + P('M15 6 L38 11 V54 L15 58Z', B) + O(34, 33, 2, Y, 'stroke-width="1.2"') +
    L('M20 20 L33 22.5 M20 44 L33 46.5', 'stroke-width="1" opacity=".45"'),
  blank:
    Rt(6, 14, 52, 36, C, 2) + L('M32 18 V46', 'stroke-width="1.2" opacity=".5"') +
    L('M38 32 H52 M38 38 H52 M38 44 H48', 'stroke-dasharray="1 3" stroke-width="1.6" opacity=".55"') +
    Rt(45, 18, 9, 10, R, 1, 'stroke-width="1.4"') +
    G_('rotate(-35 20 36)', Rt(8, 33, 22, 6, Y, 1) + P('M30 33 L36 36 L30 39Z', '#E8C9A0', 'stroke-width="1.4"')),
  egg:
    P('M32 5 Q50 5 50 36 Q50 57 32 57 Q14 57 14 36 Q14 5 32 5Z', C) +
    E(24, 40, 2, 1.2, G, 'stroke="none"') + E(38, 31, 2.2, 1.3, B, 'stroke="none"') + E(30, 49, 2, 1.2, G, 'stroke="none"') + E(40, 45, 1.8, 1.1, R, 'stroke="none"') +
    L('M22 22 Q24 14 29 11', 'stroke="#fff" stroke-width="2.5" opacity=".8"'),
}

// Full <g> markup with the shared ink style (used by the component and the PNG exporter).
export const artMarkup = (id: string) =>
  `<g fill="none" stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">` +
  `<ellipse cx="32" cy="60" rx="18" ry="2.5" fill="rgba(64,59,54,.16)" stroke="none"/>${ART[id] ?? ''}</g>`
