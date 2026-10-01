import React from 'react';

/**
 * C.24.14C-CEO — Executive Intelligence Core (decorative atmosphere).
 * Non-interactive layers: neural field, sovereign orbitals, particles, signal beam.
 * Visual match target: premium gold command-center mockup (orbits + sparks + depth).
 */
export function ExecutiveIntelligenceField({ className = '' }) {
  return (
    <div
      className={`ceo-intelligence-core ceo-intelligence-field ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="ceo-intelligence-core-obsidian" />
      <div className="ceo-intelligence-core-beam" />

      <svg
        className="ceo-intelligence-core-orbitals"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <radialGradient id="ceoIntelOrbitGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.55)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
        </defs>

        <g transform="translate(-260 0)">
        <g className="ceo-intelligence-core-orbit-field" fill="none">
          <ellipse
            cx="900"
            cy="248"
            rx="702"
            ry="510"
            stroke="rgba(245, 197, 92, 0.08)"
            strokeWidth="0.45"
            strokeDasharray="320 980"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="648"
            ry="478"
            stroke="rgba(245, 197, 92, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="260 860"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="592"
            ry="440"
            stroke="rgba(243, 218, 138, 0.11)"
            strokeWidth="0.5"
            strokeDasharray="1.4 42"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="538"
            ry="404"
            stroke="rgba(245, 197, 92, 0.13)"
            strokeWidth="0.55"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="486"
            ry="368"
            stroke="rgba(212, 175, 55, 0.16)"
            strokeWidth="0.6"
            strokeDasharray="4 22"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="438"
            ry="336"
            stroke="rgba(245, 197, 92, 0.18)"
            strokeWidth="0.65"
            strokeDasharray="1.8 26"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="392"
            ry="306"
            stroke="rgba(245, 197, 92, 0.2)"
            strokeWidth="0.7"
            strokeDasharray="1 32"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="348"
            ry="276"
            stroke="rgba(245, 197, 92, 0.22)"
            strokeWidth="0.75"
            strokeDasharray="2 28"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="310"
            ry="248"
            stroke="rgba(243, 218, 138, 0.24)"
            strokeWidth="0.8"
            strokeDasharray="2 22"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="268"
            ry="218"
            stroke="rgba(245, 197, 92, 0.26)"
            strokeWidth="0.85"
            strokeDasharray="5 18"
          />
        </g>

        <g className="ceo-intelligence-core-orbit-group">
          <ellipse
            cx="900"
            cy="248"
            rx="228"
            ry="178"
            fill="none"
            stroke="rgba(212, 175, 55, 0.32)"
            strokeWidth="1.05"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="188"
            ry="148"
            fill="none"
            stroke="rgba(243, 218, 138, 0.28)"
            strokeWidth="0.85"
            strokeDasharray="3 13"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="148"
            ry="116"
            fill="none"
            stroke="rgba(245, 197, 92, 0.42)"
            strokeWidth="1.05"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="108"
            ry="86"
            fill="none"
            stroke="rgba(243, 218, 138, 0.26)"
            strokeWidth="0.8"
            strokeDasharray="2 9"
          />
          <circle
            cx="900"
            cy="248"
            r="70"
            fill="none"
            stroke="rgba(245, 197, 92, 0.2)"
            strokeWidth="0.75"
            strokeDasharray="1 11"
          />
          <circle
            cx="900"
            cy="248"
            r="52"
            fill="none"
            stroke="rgba(245, 197, 92, 0.5)"
            strokeWidth="1.2"
          />
          <circle
            cx="900"
            cy="248"
            r="28"
            fill="none"
            stroke="rgba(243, 218, 138, 0.5)"
            strokeWidth="1.05"
          />
          <circle cx="1168" cy="248" r="2.6" fill="url(#ceoIntelOrbitGlow)" />
          <circle cx="632" cy="248" r="2.2" fill="url(#ceoIntelOrbitGlow)" />
          <circle cx="1088" cy="120" r="1.8" fill="rgba(243, 218, 138, 0.78)" />
        </g>

        <g className="ceo-intelligence-core-orbit-nodes" fill="none">
          <circle cx="1386" cy="96" r="1.6" fill="rgba(243, 218, 138, 0.42)" />
          <circle cx="1428" cy="186" r="1.4" fill="rgba(245, 197, 92, 0.38)" />
          <circle cx="1412" cy="318" r="1.5" fill="rgba(243, 218, 138, 0.4)" />
          <circle cx="1348" cy="412" r="1.3" fill="rgba(212, 175, 55, 0.36)" />
          <circle cx="1264" cy="58" r="1.25" fill="rgba(245, 197, 92, 0.34)" />
          <circle cx="1188" cy="36" r="1.15" fill="rgba(243, 218, 138, 0.32)" />
          <circle cx="454" cy="96" r="1.2" fill="rgba(243, 218, 138, 0.28)" />
          <circle cx="398" cy="186" r="1.05" fill="rgba(245, 197, 92, 0.24)" />
          <circle cx="412" cy="328" r="1.1" fill="rgba(212, 175, 55, 0.22)" />
          <circle cx="508" cy="428" r="1.05" fill="rgba(243, 218, 138, 0.26)" />
          <circle cx="900" cy="16" r="1" fill="rgba(245, 197, 92, 0.28)" />
          <circle cx="1048" cy="22" r="1.05" fill="rgba(243, 218, 138, 0.34)" />
          <circle cx="752" cy="22" r="0.9" fill="rgba(245, 197, 92, 0.24)" />
          <circle cx="1288" cy="248" r="1.2" fill="rgba(243, 218, 138, 0.36)" />
          <circle cx="512" cy="248" r="0.95" fill="rgba(212, 175, 55, 0.22)" />
          <circle cx="1216" cy="148" r="0.95" fill="rgba(245, 197, 92, 0.3)" />
          <circle cx="1216" cy="348" r="0.9" fill="rgba(243, 218, 138, 0.28)" />
          <circle cx="1088" cy="468" r="0.85" fill="rgba(245, 197, 92, 0.24)" />
          <circle cx="712" cy="468" r="0.8" fill="rgba(243, 218, 138, 0.22)" />
          <circle cx="900" cy="38" r="1.7" fill="rgba(243, 218, 138, 0.4)" />
          <circle cx="900" cy="458" r="1.6" fill="rgba(245, 197, 92, 0.36)" />
          <circle cx="1088" cy="376" r="1.5" fill="rgba(245, 197, 92, 0.42)" />
          <circle cx="712" cy="120" r="1.4" fill="rgba(243, 218, 138, 0.38)" />
          <circle cx="712" cy="376" r="1.4" fill="rgba(212, 175, 55, 0.36)" />
          <circle cx="1040" cy="78" r="1.3" fill="rgba(245, 197, 92, 0.34)" />
          <circle cx="760" cy="418" r="1.2" fill="rgba(243, 218, 138, 0.32)" />
          <circle cx="1008" cy="168" r="1.15" fill="rgba(243, 218, 138, 0.36)" />
          <circle cx="792" cy="328" r="1.1" fill="rgba(245, 197, 92, 0.3)" />
          <circle cx="968" cy="402" r="1.05" fill="rgba(212, 175, 55, 0.3)" />
          <circle cx="832" cy="94" r="1.05" fill="rgba(243, 218, 138, 0.28)" />
          <circle cx="1128" cy="210" r="1.2" fill="rgba(245, 197, 92, 0.34)" />
          <circle cx="672" cy="210" r="1.1" fill="rgba(243, 218, 138, 0.28)" />
          <circle cx="918" cy="214" r="1.05" fill="rgba(243, 218, 138, 0.4)" />
          <circle cx="882" cy="278" r="0.95" fill="rgba(245, 197, 92, 0.36)" />
        </g>

        <g className="ceo-intelligence-core-arcs" fill="none" opacity="0.55">
          <path
            d="M 300 318 C 470 286, 680 262, 868 250"
            stroke="rgba(245, 197, 92, 0.2)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d="M 270 372 C 460 344, 690 288, 874 256"
            stroke="rgba(243, 218, 138, 0.16)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 900 248 C 700 252, 520 262, 310 258"
            stroke="rgba(245, 197, 92, 0.08)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 900 248 C 710 336, 500 392, 280 428"
            stroke="rgba(243, 218, 138, 0.12)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M 860 200 C 680 120, 520 90, 380 78"
            stroke="rgba(243, 218, 138, 0.05)"
            strokeWidth="0.65"
            strokeDasharray="3 16"
          />
          <path
            d="M 360 42 C 560 8, 760 64, 872 188"
            stroke="rgba(245, 197, 92, 0.18)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d="M 420 18 C 680 -8, 980 36, 1220 110"
            stroke="rgba(243, 218, 138, 0.14)"
            strokeWidth="0.7"
            strokeDasharray="3 18"
            strokeLinecap="round"
          />
          <path
            d="M 220 448 C 520 512, 820 488, 900 332"
            stroke="rgba(245, 197, 92, 0.16)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d="M 260 430 C 400 400, 540 455, 680 390 S 800 300, 880 268"
            stroke="rgba(243, 218, 138, 0.14)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
        </g>
      </svg>

      <svg
        className="ceo-intelligence-core-neural ceo-intelligence-field-network"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <radialGradient id="ceoIntelCoreNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.78)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
          <linearGradient id="ceoIntelCoreLink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0)" />
            <stop offset="38%" stopColor="rgba(245, 197, 92, 0.32)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </linearGradient>
          <radialGradient id="ceoIntelCoreHub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 197, 92, 0.2)" />
            <stop offset="55%" stopColor="rgba(212, 175, 55, 0.06)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
        </defs>

        <g transform="translate(-260 0)">
        <g className="ceo-intelligence-core-mesh" opacity="0.38">
          <path
            d="M 140 130 C 340 90, 620 140, 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.7"
            opacity="0.42"
          />
          <path
            d="M 120 270 C 320 250, 600 270, 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.95"
          />
          <path
            d="M 180 390 C 400 360, 660 320, 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.9"
          />
          <path
            d="M 220 70 C 480 40, 720 120, 860 200"
            fill="none"
            stroke="rgba(245, 197, 92, 0.08)"
            strokeWidth="0.7"
          />
          <path
            d="M 160 430 C 420 410, 680 360, 900 248"
            fill="none"
            stroke="rgba(243, 218, 138, 0.16)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        <g className="ceo-intelligence-core-nodes" fill="url(#ceoIntelCoreNode)">
          <circle cx="140" cy="130" r="2.2" />
          <circle cx="340" cy="96" r="2" />
          <circle cx="620" cy="148" r="2.4" />
          <circle cx="120" cy="270" r="1.9" />
          <circle cx="320" cy="252" r="2.1" />
          <circle cx="600" cy="268" r="2" />
          <circle cx="180" cy="390" r="1.8" />
          <circle cx="400" cy="352" r="2" />
          <circle cx="660" cy="312" r="1.9" />
          <circle cx="220" cy="70" r="1.6" />
          <circle cx="480" cy="48" r="1.7" />
          <circle cx="720" cy="128" r="1.9" />
          <circle cx="500" cy="220" r="1.5" />
          <circle cx="430" cy="300" r="1.4" />
          <circle cx="470" cy="288" r="1.35" />
          <circle cx="680" cy="264" r="1.5" />
          <circle cx="460" cy="346" r="1.2" />
          <circle cx="690" cy="290" r="1.25" />
        </g>

        {/* Fine spark / star field */}
        <g className="ceo-intelligence-core-sparks" fill="rgba(243, 218, 138, 0.78)">
          <circle className="ceo-intelligence-core-spark-twinkle" cx="148" cy="18" r="1.15" opacity="0.82" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="510" cy="28" r="1.05" opacity="0.74" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="718" cy="16" r="1.2" opacity="0.8" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="1248" cy="132" r="1.05" opacity="0.7" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="64" cy="58" r="1.25" opacity="0.78" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="888" cy="236" r="1.1" opacity="0.72" />
          <circle cx="760" cy="80" r="0.85" opacity="0.48" />
          <circle cx="820" cy="400" r="0.7" opacity="0.36" />
          <circle cx="680" cy="240" r="0.65" opacity="0.32" />
          <circle cx="880" cy="60" r="0.9" opacity="0.52" />
          <circle cx="960" cy="400" r="0.7" opacity="0.34" />
          <circle cx="1040" cy="200" r="0.65" opacity="0.3" />
          <circle cx="640" cy="140" r="0.6" opacity="0.28" />
          <circle cx="430" cy="52" r="0.45" opacity="0.22" />
          <circle cx="590" cy="64" r="0.35" opacity="0.16" />
          <circle cx="1020" cy="44" r="0.55" opacity="0.3" />
          <circle cx="1140" cy="88" r="0.45" opacity="0.22" />
          <circle cx="1330" cy="70" r="0.4" opacity="0.18" />
          <circle cx="400" cy="410" r="0.5" opacity="0.24" />
          <circle cx="520" cy="448" r="0.35" opacity="0.16" />
          <circle cx="640" cy="470" r="0.6" opacity="0.32" />
          <circle cx="1088" cy="430" r="0.45" opacity="0.22" />
          <circle cx="1180" cy="390" r="0.55" opacity="0.28" />
          <circle cx="1288" cy="450" r="0.4" opacity="0.18" />
          <circle cx="92" cy="96" r="0.32" opacity="0.14" />
          <circle cx="184" cy="54" r="0.38" opacity="0.16" />
          <circle cx="268" cy="22" r="0.3" opacity="0.12" />
          <circle cx="352" cy="78" r="0.36" opacity="0.15" />
          <circle cx="468" cy="12" r="0.42" opacity="0.2" />
          <circle cx="556" cy="48" r="0.3" opacity="0.12" />
          <circle cx="644" cy="8" r="0.34" opacity="0.14" />
          <circle cx="792" cy="42" r="0.4" opacity="0.18" />
          <circle cx="876" cy="14" r="0.32" opacity="0.13" />
          <circle cx="964" cy="56" r="0.36" opacity="0.15" />
          <circle cx="1096" cy="18" r="0.3" opacity="0.12" />
          <circle cx="1188" cy="62" r="0.38" opacity="0.16" />
          <circle cx="36" cy="168" r="0.34" opacity="0.14" />
          <circle cx="78" cy="252" r="0.3" opacity="0.12" />
          <circle cx="24" cy="336" r="0.4" opacity="0.18" />
          <circle cx="112" cy="388" r="0.32" opacity="0.13" />
          <circle cx="48" cy="464" r="0.36" opacity="0.15" />
          <circle cx="196" cy="492" r="0.3" opacity="0.12" />
          <circle cx="848" cy="268" r="0.5" opacity="0.22" />
          <circle cx="940" cy="248" r="0.45" opacity="0.2" />
          <circle cx="780" cy="248" r="0.4" opacity="0.16" />
          <circle cx="900" cy="180" r="0.42" opacity="0.18" />
          <circle cx="900" cy="320" r="0.42" opacity="0.18" />
        </g>

        <circle
          className="ceo-intelligence-core-hub"
          cx="900"
          cy="248"
          r="10"
          fill="url(#ceoIntelCoreHub)"
        />
        <circle
          className="ceo-intelligence-core-hub-ring"
          cx="900"
          cy="248"
          r="34"
          fill="none"
          stroke="rgba(245, 197, 92, 0.42)"
          strokeWidth="1.15"
        />
        </g>
        <g className="ceo-intelligence-core-east" fill="none" opacity="0.5">
          <path
            d="M 640 248 C 780 198, 940 168, 1108 148"
            stroke="rgba(245, 197, 92, 0.22)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <path
            d="M 640 248 C 800 292, 960 330, 1120 352"
            stroke="rgba(212, 175, 55, 0.16)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M 660 186 C 820 122, 990 104, 1160 94"
            stroke="rgba(243, 218, 138, 0.1)"
            strokeWidth="0.7"
            strokeDasharray="3 16"
          />
          <path
            d="M 700 36 C 900 8, 1080 72, 1188 210"
            stroke="rgba(245, 197, 92, 0.2)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <path
            d="M 720 468 C 900 508, 1088 478, 1184 352"
            stroke="rgba(243, 218, 138, 0.16)"
            strokeWidth="0.7"
            strokeDasharray="2 16"
            strokeLinecap="round"
          />
        </g>
        <g className="ceo-intelligence-core-east-nodes" fill="rgba(243, 218, 138, 0.74)">
          <circle cx="780" cy="196" r="2.1" />
          <circle cx="940" cy="164" r="2.3" />
          <circle cx="1108" cy="142" r="2.5" />
          <circle cx="960" cy="326" r="1.9" />
          <circle cx="1120" cy="348" r="2.2" />
          <circle cx="1024" cy="92" r="1.7" />
          <circle cx="1148" cy="218" r="1.3" />
          <circle cx="1172" cy="286" r="1.2" />
          <circle cx="1008" cy="408" r="1.15" />
          <circle cx="868" cy="64" r="1.3" />
          <circle cx="1080" cy="260" r="1.1" />
          <circle cx="920" cy="44" r="1.2" />
          <circle cx="1048" cy="52" r="1.8" />
          <circle cx="1140" cy="118" r="2" />
          <circle cx="1172" cy="188" r="1.6" />
          <circle cx="1160" cy="392" r="1.7" />
          <circle cx="1068" cy="456" r="1.4" />
          <circle cx="988" cy="28" r="1.35" />
        </g>
        <g className="ceo-intelligence-core-west-sparks" fill="rgba(243, 218, 138, 0.72)">
          <circle className="ceo-intelligence-core-spark-twinkle" cx="108" cy="404" r="1.05" opacity="0.7" />
          <circle className="ceo-intelligence-core-spark-twinkle" cx="598" cy="496" r="1.1" opacity="0.68" />
          <circle cx="188" cy="128" r="0.45" opacity="0.2" />
          <circle cx="248" cy="168" r="0.75" opacity="0.4" />
          <circle cx="312" cy="198" r="0.85" />
          <circle cx="372" cy="226" r="0.95" />
          <circle cx="220" cy="86" r="0.55" opacity="0.28" />
          <circle cx="290" cy="300" r="0.95" />
          <circle cx="160" cy="210" r="0.7" opacity="0.38" />
          <circle cx="210" cy="248" r="0.75" />
          <circle cx="340" cy="330" r="0.85" />
          <circle cx="400" cy="180" r="0.55" opacity="0.32" />
          <circle cx="360" cy="360" r="0.8" />
          <circle cx="430" cy="390" r="0.7" />
          <circle cx="280" cy="410" r="0.65" />
          <circle cx="72" cy="36" r="0.7" opacity="0.42" />
          <circle cx="148" cy="18" r="1.05" opacity="0.68" />
          <circle cx="236" cy="44" r="0.55" opacity="0.32" />
          <circle cx="318" cy="14" r="0.9" opacity="0.58" />
          <circle cx="412" cy="38" r="0.6" opacity="0.36" />
          <circle cx="508" cy="12" r="0.8" opacity="0.52" />
          <circle cx="602" cy="30" r="0.5" opacity="0.3" />
          <circle cx="718" cy="16" r="1.1" opacity="0.7" />
          <circle cx="844" cy="34" r="0.65" opacity="0.42" />
          <circle cx="972" cy="14" r="0.85" opacity="0.55" />
          <circle cx="1088" cy="40" r="0.55" opacity="0.34" />
          <circle cx="1164" cy="22" r="0.75" opacity="0.48" />
          <circle cx="32" cy="88" r="0.6" opacity="0.38" />
          <circle cx="68" cy="142" r="0.9" opacity="0.58" />
          <circle cx="44" cy="196" r="0.5" opacity="0.3" />
          <circle cx="92" cy="238" r="0.7" opacity="0.45" />
          <circle cx="38" cy="286" r="1.0" opacity="0.64" />
          <circle cx="76" cy="334" r="0.55" opacity="0.34" />
          <circle cx="28" cy="378" r="0.8" opacity="0.5" />
          <circle cx="52" cy="448" r="0.6" opacity="0.4" />
          <circle cx="136" cy="478" r="0.85" opacity="0.54" />
          <circle cx="198" cy="504" r="0.7" opacity="0.44" />
          <circle cx="276" cy="488" r="1.0" opacity="0.66" />
          <circle cx="354" cy="510" r="0.5" opacity="0.3" />
          <circle cx="438" cy="490" r="0.8" opacity="0.5" />
          <circle cx="522" cy="512" r="0.65" opacity="0.4" />
          <circle cx="676" cy="514" r="0.55" opacity="0.34" />
          <circle cx="754" cy="488" r="0.75" opacity="0.46" />
          <circle cx="838" cy="506" r="0.6" opacity="0.38" />
          <circle cx="916" cy="486" r="0.95" opacity="0.6" />
          <circle cx="998" cy="502" r="0.5" opacity="0.3" />
          <circle cx="1118" cy="490" r="0.7" opacity="0.44" />
          <circle cx="178" cy="96" r="0.5" opacity="0.28" />
          <circle cx="258" cy="252" r="0.7" opacity="0.4" />
          <circle cx="148" cy="318" r="0.55" opacity="0.32" />
          <circle cx="1048" cy="198" r="0.6" opacity="0.38" />
          <circle cx="1126" cy="254" r="0.85" opacity="0.52" />
          <circle cx="1072" cy="322" r="0.55" opacity="0.34" />
          <circle cx="1154" cy="404" r="0.75" opacity="0.46" />
          <circle cx="1182" cy="158" r="0.5" opacity="0.3" />
          <circle cx="64" cy="58" r="1.35" opacity="0.78" />
          <circle cx="1188" cy="72" r="1.25" opacity="0.72" />
          <circle cx="640" cy="8" r="0.9" opacity="0.56" />
        </g>
      </svg>

      <div className="ceo-intelligence-field-scan ceo-intelligence-core-sheen" />
      <div className="ceo-intelligence-field-vignette ceo-intelligence-core-vignette" />
    </div>
  );
}

export default ExecutiveIntelligenceField;
