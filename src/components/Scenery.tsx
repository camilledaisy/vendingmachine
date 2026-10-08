// Little illustrated bits of the street: the cat, a party hat, a topiary, a flyer.
export const Cat = () => (
  <svg viewBox="0 0 92 46" width="92" height="46" aria-hidden>
    <g stroke="#403B36" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M10 38 Q-2 34 4 22" fill="none" strokeWidth="5" stroke="#403B36" />
      <path d="M10 38 Q-2 34 4 22" fill="none" strokeWidth="2.5" stroke="#fff" />
      <ellipse cx="42" cy="32" rx="34" ry="11" fill="#fff" />
      <circle cx="72" cy="26" r="12" fill="#fff" />
      <path d="M62 20 L63 8 L71 15Z" fill="#fff" />
      <path d="M82 20 L82 8 L74 15Z" fill="#fff" />
      <path d="M64 8 L66 13 L63 13Z M81 8 L79 13 L82 13Z" fill="#D4A5A5" strokeWidth="1" />
      <path d="M65 27 q2.5 2.5 5 0 M74 27 q2.5 2.5 5 0" fill="none" strokeWidth="1.6" />
      <path d="M71 31 h3 l-1.5 2z" fill="#D4A5A5" strokeWidth="1" />
      <circle cx="64" cy="31" r="2.2" fill="#D4A5A5" stroke="none" opacity=".7" />
      <circle cx="80" cy="31" r="2.2" fill="#D4A5A5" stroke="none" opacity=".7" />
      <path d="M30 24 q4 -2 8 0 M44 23 q4 -2 8 0" fill="none" strokeWidth="1" opacity=".25" />
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
