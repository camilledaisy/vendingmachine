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

export const Flyer = () => (
  <div className="paper w-[96px] rotate-[-4deg] border-2 border-charcoal p-2 text-center font-hand text-[17px] leading-[1.05] text-charcoal shadow-md" aria-hidden>
    <span className="mx-auto mb-1 block h-2 w-8 rotate-3 bg-butter/80" />
    LOST: one sock.
    <br />
    Reward: a different sock.
  </div>
)
