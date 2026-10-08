// Little illustrated bits of the street: the cat, a party hat, a topiary, a flyer.
export const Cat = () => (
  <svg viewBox="0 0 104 58" width="104" height="58" aria-hidden overflow="visible">
    <g stroke="#403B36" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <g className="cat-tail">
        <path d="M14 46 Q-4 48 0 32 Q3 22 10 26" fill="none" stroke="#403B36" strokeWidth="7.5" />
        <path d="M14 46 Q-4 48 0 32 Q3 22 10 26" fill="none" stroke="#FFFAF0" strokeWidth="3.8" />
        <path d="M2 38 h4 M3 31 h4" stroke="#D4A5A5" strokeWidth="2" />
      </g>
      <g className="cat-breath">
        <path d="M10 52 Q8 30 40 28 Q72 26 84 38 L86 52Z" fill="#FFFAF0" />
        <path d="M26 31 Q40 27 54 29 Q50 38 38 38 Q28 38 26 31Z" fill="#D4A5A5" stroke="none" />
        <path d="M24 44 q3 -3 6 0 M40 46 q3 -3 6 0" fill="none" strokeWidth="1.2" opacity=".28" />
        <path d="M10 52 Q8 30 40 28 Q72 26 84 38 L86 52Z" fill="none" />
      </g>
      <g className="cat-head">
        <g className="cat-ear"><path d="M68 24 L69 8 L80 18Z" fill="#FFFAF0" /><path d="M71 20 L71 13 L76 18Z" fill="#D4A5A5" strokeWidth="0" /></g>
        <path d="M96 24 L96 8 L86 18Z" fill="#FFFAF0" />
        <path d="M94 20 L94 13 L90 18Z" fill="#D4A5A5" strokeWidth="0" />
        <ellipse cx="82" cy="34" rx="16" ry="14" fill="#FFFAF0" />
        <path d="M74 22 Q82 26 90 22 Q92 28 82 30 Q72 28 74 22Z" fill="#D4A5A5" stroke="none" opacity=".75" />
        <path d="M73 33 q3 3 6 0 M86 33 q3 3 6 0" fill="none" strokeWidth="1.8" />
        <path d="M81 38 h4 l-2 2.5z" fill="#914F4F" strokeWidth="1" />
        <path d="M83 40.5 v2 q-2 2 -4 1 M83 42.5 q2 2 4 1" fill="none" strokeWidth="1" />
        <path d="M66 38 h-7 M66 41 l-6 2 M100 38 h7 M100 41 l6 2" fill="none" strokeWidth="1" opacity=".5" />
        <circle cx="71" cy="39" r="2.6" fill="#D4A5A5" stroke="none" opacity=".6" />
        <circle cx="95" cy="39" r="2.6" fill="#D4A5A5" stroke="none" opacity=".6" />
      </g>
      <ellipse cx="72" cy="52" rx="7" ry="3.6" fill="#FFFAF0" />
      <ellipse cx="90" cy="52" rx="7" ry="3.6" fill="#FFFAF0" />
    </g>
    <g fill="#403B36" fontFamily="'Pixelify Sans',monospace" fontWeight="700" stroke="none">
      <text className="cat-z" x="98" y="14" fontSize="9">z</text>
      <text className="cat-z cat-z2" x="104" y="6" fontSize="11">z</text>
      <text className="cat-z cat-z3" x="110" y="-4" fontSize="13">Z</text>
    </g>
  </svg>
)

export const PartyHat = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 30 36" width="34" height="40" className={className} aria-hidden>
    <g stroke="#403B36" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M15 4 L27 32 H3Z" fill="#F2D98D" />
      <path d="M11 14 L19 14 M8 23 L22 23" stroke="#914F4F" strokeWidth="3" fill="none" />
      <circle cx="15" cy="4" r="3.2" fill="#D4A5A5" />
    </g>
  </svg>
)

export const Topiary = () => (
  <svg viewBox="0 0 90 190" width="90" height="190" aria-hidden>
    <g stroke="#403B36" strokeWidth="2.5" strokeLinejoin="round">
      <ellipse cx="45" cy="38" rx="30" ry="34" fill="#6F9A68" />
      <ellipse cx="38" cy="30" rx="12" ry="18" fill="#86B17E" stroke="none" opacity=".7" />
      <ellipse cx="45" cy="98" rx="36" ry="40" fill="#5E8A5C" />
      <ellipse cx="36" cy="88" rx="14" ry="22" fill="#7AA874" stroke="none" opacity=".7" />
      <path d="M45 134 V152" fill="none" />
      <path d="M14 150 H76 L70 188 H20Z" fill="#B5724F" />
      <rect x="10" y="144" width="70" height="12" rx="3" fill="#C98660" />
    </g>
  </svg>
)

// ---- the street around the machine (placed in App) ----

export const Lamp = () => (
  <div className="relative h-[430px] w-[130px]" aria-hidden>
    <div className="lamp-glow absolute -left-[27px] -top-[99px] h-[260px] w-[260px] rounded-full" />
    <svg viewBox="0 0 130 430" width="130" height="430" className="relative">
      <g stroke="#403B36" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M62 428 V70 Q62 24 104 24" fill="none" stroke="#403B36" strokeWidth="9" />
        <path d="M62 428 V70 Q62 24 104 24" fill="none" stroke="#6D655C" strokeWidth="4" />
        <rect x="52" y="392" width="20" height="36" rx="3" fill="#6D655C" />
        <path d="M84 24 H122 L116 14 H90Z" fill="#6D655C" />
        <path d="M88 24 H118 L112 38 H94Z" fill="#F2D98D" />
      </g>
    </svg>
    {[0, 1, 2].map((i) => (
      <i key={i} className="moth" style={{ ['--d' as string]: `${-i * 2.1}s`, ['--r' as string]: `${26 + i * 8}px` }}>
        <b />
      </i>
    ))}
  </div>
)

export const NeonSign = () => (
  <div className="relative" aria-hidden>
    <svg viewBox="0 0 160 14" width="160" height="14" className="absolute -top-3 left-0">
      <path d="M30 14 V0 M130 14 V0" stroke="#403B36" strokeWidth="2.5" strokeDasharray="3 2" />
    </svg>
    <div className="neon rounded-lg border-[3px] border-charcoal bg-charcoal px-4 py-2 text-center font-display leading-none">
      <span className="neon-a block text-[22px] font-bold tracking-[.2em]">OPEN</span>
      <span className="neon-b mt-1 block text-[12px] tracking-[.35em]">24 HRS</span>
    </div>
  </div>
)

export const TearFlyer = () => (
  <div className="paper w-[118px] rotate-[3deg] border-2 border-charcoal pt-2 text-center shadow-md" aria-hidden>
    <span className="mx-auto mb-1 block h-2.5 w-9 -rotate-2 bg-rose/80" />
    <p className="font-display text-[15px] font-bold leading-none text-burgundy">FREE</p>
    <p className="px-1 font-hand text-[19px] font-bold leading-[1] text-charcoal">strong feelings.</p>
    <p className="font-hand text-[15px] leading-none text-charcoal/80">take one</p>
    <div className="mt-2 flex h-[54px] border-t-2 border-dashed border-charcoal/60">
      {[1, 1, 0, 1, 0, 1].map((on, i) => (
        <span key={i} className={`flex-1 border-r border-dashed border-charcoal/40 text-center font-hand text-[11px] leading-none text-charcoal ${on ? '' : 'invisible'}`} style={{ writingMode: 'vertical-rl' }}>
          take one
        </span>
      ))}
    </div>
  </div>
)

export const Window = () => (
  <svg viewBox="0 0 120 150" width="120" height="150" aria-hidden>
    <g stroke="#403B36" strokeWidth="3" strokeLinejoin="round">
      <rect x="10" y="8" width="100" height="116" rx="5" fill="#E7D6C2" />
      <rect x="18" y="16" width="84" height="100" rx="3" fill="#F6DF96" />
      <path d="M60 16 V116 M18 66 H102" stroke="#403B36" strokeWidth="3" />
      <path d="M18 16 Q34 40 30 116 H18Z" fill="#D4A5A5" />
      <path d="M102 16 Q86 40 90 116 H102Z" fill="#D4A5A5" />
      <rect x="4" y="124" width="112" height="14" rx="3" fill="#C9B79D" />
      <path d="M72 124 Q70 104 78 96 Q84 106 82 124Z" fill="#6F9A68" strokeWidth="2" />
      <path d="M82 124 Q88 108 100 108 Q96 120 92 124Z" fill="#86B17E" strokeWidth="2" />
      <rect x="66" y="118" width="30" height="7" rx="1.5" fill="#B5724F" strokeWidth="2" />
    </g>
    <ellipse cx="46" cy="104" rx="10" ry="8" fill="#403B36" opacity=".55" />
  </svg>
)

export const Pigeon = () => (
  <div className="pigeon-walk" aria-hidden>
    <svg viewBox="0 0 48 36" width="48" height="36" className="overflow-visible">
      <g stroke="#403B36" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M6 20 L0 24 L8 24Z" fill="#8F9AA3" />
        <ellipse cx="22" cy="21" rx="15" ry="9" fill="#A9B3BB" />
        <path d="M12 20 Q20 14 30 22 Q20 28 12 20Z" fill="#8F9AA3" strokeWidth="1.5" />
        <g className="pigeon-head">
          <circle cx="37" cy="12" r="6.5" fill="#A9B3BB" />
          <path d="M42 11 L48 13 L42 15Z" fill="#E8A25A" strokeWidth="1.5" />
          <circle cx="38" cy="10.5" r="1.3" fill="#403B36" stroke="none" />
          <path d="M31 16 Q36 20 41 16" fill="none" stroke="#7D6A9B" strokeWidth="3" opacity=".7" />
        </g>
        <path d="M24 30 V35 M30 30 V35" fill="none" stroke="#E8A25A" strokeWidth="2" />
      </g>
    </svg>
  </div>
)
