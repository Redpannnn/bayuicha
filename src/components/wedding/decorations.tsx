import * as React from "react";

/** Generate an SVG path for a rectangle with smooth semicircle scalloped top & bottom edges. */
function scallopedPath(w: number, h: number, scallops: number) {
  const r = w / (scallops * 2);
  let d = `M0 ${r} `;
  // top scallops (bulge up), left to right — sweep=0 (ccw)
  for (let i = 0; i < scallops; i++) {
    const x2 = (i + 1) * 2 * r;
    d += `A ${r} ${r} 0 0 0 ${x2.toFixed(2)} ${r} `;
  }
  // right side down
  d += `L ${w} ${h - r} `;
  // bottom scallops (bulge down), right to left — sweep=1 (cw)
  for (let i = 0; i < scallops; i++) {
    const x2 = w - (i + 1) * 2 * r;
    d += `A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${h - r} `;
  }
  d += `Z`;
  return d;
}

/* ============================================================
   Hanging Garland — yellow-green wisteria strands + tassels
   ============================================================ */
export function Garland({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 120"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* top rope */}
      <path
        d="M0 6 Q100 26 200 14 T400 6"
        fill="none"
        stroke="#7c8a4f"
        strokeWidth="2.5"
      />
      {/* strands */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 14 + i * 21;
        const top = 10 + Math.sin(i * 0.6) * 10;
        return (
          <g key={i}>
            <line
              x1={x}
              y1={top}
              x2={x}
              y2={top + 38 + (i % 3) * 8}
              stroke="#7c8a4f"
              strokeWidth="1.4"
            />
            {/* leaves */}
            {[0, 1, 2].map((j) => (
              <ellipse
                key={j}
                cx={x}
                cy={top + 12 + j * 12}
                rx="6"
                ry="3"
                fill={j % 2 === 0 ? "#9caa5e" : "#c9d176"}
                transform={`rotate(${j % 2 === 0 ? -20 : 20} ${x} ${top + 12 + j * 12})`}
              />
            ))}
            {/* berry */}
            <circle cx={x} cy={top + 40 + (i % 3) * 8} r="3.5" fill="#e3b23c" />
          </g>
        );
      })}
      {/* tassels */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 40 + i * 56;
        return (
          <g key={`t-${i}`}>
            <line
              x1={x}
              y1={20}
              x2={x}
              y2={70}
              stroke="#e3b23c"
              strokeWidth="1.4"
            />
            <rect
              x={x - 4}
              y={70}
              width="8"
              height="14"
              rx="2"
              fill="#e3b23c"
            />
            <line
              x1={x}
              y1={84}
              x2={x - 5}
              y2={94}
              stroke="#c89627"
              strokeWidth="1.4"
            />
            <line
              x1={x}
              y1={84}
              x2={x}
              y2={96}
              stroke="#c89627"
              strokeWidth="1.4"
            />
            <line
              x1={x}
              y1={84}
              x2={x + 5}
              y2={94}
              stroke="#c89627"
              strokeWidth="1.4"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   Oval Lace Frame — ornate maroon lace/doily oval border
   ============================================================ */
export function OvalLaceFrame({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const gid = React.useId().replace(/[:]/g, "");
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 320 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`lace-${gid}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#b85a6a" />
            <stop offset="100%" stopColor="#8a3548" />
          </radialGradient>
        </defs>
        {/* outer scalloped lace — large half-circles */}
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i / 32) * Math.PI * 2;
          const rx = 155;
          const ry = 195;
          const cx = 160 + Math.cos(a) * rx;
          const cy = 200 + Math.sin(a) * ry;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="15"
              fill={`url(#lace-${gid})`}
            />
          );
        })}
        {/* main bold oval ring */}
        <ellipse
          cx="160"
          cy="200"
          rx="142"
          ry="182"
          fill="none"
          stroke={`url(#lace-${gid})`}
          strokeWidth="14"
        />
        {/* inner filigree ring */}
        <ellipse
          cx="160"
          cy="200"
          rx="128"
          ry="168"
          fill="none"
          stroke="#6a2435"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />
        {/* tiny flower dots around inner ring */}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const cx = 160 + Math.cos(a) * 132;
          const cy = 200 + Math.sin(a) * 172;
          return (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <circle r="2.8" fill="#fdf8f0" />
              <circle r="1.2" fill="#6a2435" />
            </g>
          );
        })}
        {/* top and bottom ornaments */}
        <g transform="translate(160 8)">
          <path d="M-10 0 Q0 -8 10 0 Z" fill="#a04050" />
          <circle r="3" fill="#e3b23c" />
        </g>
        <g transform="translate(160 392)">
          <path d="M-10 0 Q0 8 10 0 Z" fill="#a04050" />
          <circle r="3" fill="#e3b23c" />
        </g>
      </svg>
      {/* image sits inside the inner oval so the lace frame shows around it */}
      <div className="absolute inset-[11%] z-10 overflow-hidden rounded-[50%] shadow-inner">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Flower Border — dense row of colorful folk flowers
   ============================================================ */
export function FlowerBorder({ className = "" }: { className?: string }) {
  const flowers = [
    { c1: "#e88a7d", c2: "#d96558", cx: "#e3b23c" },
    { c1: "#b9a3d9", c2: "#8e74b8", cx: "#e3b23c" },
    { c1: "#e3b23c", c2: "#c89627", cx: "#a04050" },
    { c1: "#7c8a4f", c2: "#5d6a38", cx: "#e3b23c" },
    { c1: "#e7b8b8", c2: "#cf9595", cx: "#a04050" },
    { c1: "#6da3c4", c2: "#4d83a8", cx: "#e3b23c" },
    { c1: "#e88a7d", c2: "#d96558", cx: "#e3b23c" },
    { c1: "#b9a3d9", c2: "#8e74b8", cx: "#e3b23c" },
    { c1: "#e3b23c", c2: "#c89627", cx: "#a04050" },
    { c1: "#7c8a4f", c2: "#5d6a38", cx: "#e3b23c" },
    { c1: "#e7b8b8", c2: "#cf9595", cx: "#a04050" },
    { c1: "#6da3c4", c2: "#4d83a8", cx: "#e3b23c" },
  ];
  return (
    <svg
      viewBox="0 0 480 90"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* leaves background */}
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={`l-${i}`}
          cx={10 + i * 30}
          cy={70}
          rx="14"
          ry="5"
          fill="#7c8a4f"
          transform={`rotate(${i % 2 === 0 ? -25 : 25} ${10 + i * 30} 70)`}
        />
      ))}
      {/* flowers */}
      {flowers.map((f, i) => {
        const x = 20 + i * 38;
        const y = 40 + (i % 2) * 8;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {Array.from({ length: 6 }).map((_, j) => {
              const a = (j / 6) * Math.PI * 2;
              return (
                <ellipse
                  key={j}
                  cx={Math.cos(a) * 9}
                  cy={Math.sin(a) * 9}
                  rx="8"
                  ry="5"
                  fill={j % 2 === 0 ? f.c1 : f.c2}
                  transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 9} ${Math.sin(a) * 9})`}
                />
              );
            })}
            <circle r="4" fill={f.cx} />
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   Mandala / Sunflower Ornament (hanging)
   ============================================================ */
export function HangingMandala({
  className = "",
  color = "#e88a7d",
  size = 80,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <div className={className} style={{ width: size, height: size + 40 }}>
      <svg viewBox="0 0 80 120" className="h-full w-full" aria-hidden="true">
        <line x1="40" y1="0" x2="40" y2="28" stroke="#7c8a4f" strokeWidth="1.5" />
        <g transform="translate(40 60)">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={Math.cos(a) * 18}
                cy={Math.sin(a) * 18}
                rx="14"
                ry="6"
                fill={color}
                transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 18} ${Math.sin(a) * 18})`}
              />
            );
          })}
          <circle r="14" fill="#e3b23c" />
          <circle r="10" fill="#c89627" />
          {/* inner petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={Math.cos(a) * 6}
                cy={Math.sin(a) * 6}
                rx="5"
                ry="2.5"
                fill="#fdf8f0"
                opacity="0.6"
              />
            );
          })}
        </g>
        {/* tassel */}
        <line x1="40" y1="92" x2="40" y2="104" stroke="#e3b23c" strokeWidth="1.2" />
        <line x1="36" y1="104" x2="44" y2="104" stroke="#e3b23c" strokeWidth="1.2" />
        <line x1="40" y1="104" x2="40" y2="116" stroke="#e3b23c" strokeWidth="1.2" />
        <line x1="40" y1="104" x2="34" y2="116" stroke="#e3b23c" strokeWidth="1" />
        <line x1="40" y1="104" x2="46" y2="116" stroke="#e3b23c" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ============================================================
   Hanging pink flower (single) on a string
   ============================================================ */
export function HangingFlower({
  className = "",
  size = 60,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={className} style={{ width: size, height: size + 50 }}>
      <svg viewBox="0 0 60 110" className="h-full w-full" aria-hidden="true">
        <path
          d="M30 0 Q28 30 30 60"
          fill="none"
          stroke="#7c8a4f"
          strokeWidth="1.5"
        />
        {/* leaves */}
        <ellipse cx="20" cy="34" rx="8" ry="3" fill="#9caa5e" transform="rotate(-30 20 34)" />
        <ellipse cx="40" cy="48" rx="8" ry="3" fill="#9caa5e" transform="rotate(30 40 48)" />
        {/* flower */}
        <g transform="translate(30 78)">
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={Math.cos(a) * 12}
                cy={Math.sin(a) * 12}
                rx="12"
                ry="7"
                fill="#e7b8b8"
                transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 12} ${Math.sin(a) * 12})`}
              />
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.3;
            return (
              <ellipse
                key={`b-${i}`}
                cx={Math.cos(a) * 9}
                cy={Math.sin(a) * 9}
                rx="9"
                ry="5"
                fill="#cf9595"
                transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 9} ${Math.sin(a) * 9})`}
              />
            );
          })}
          <circle r="6" fill="#e3b23c" />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   Ornate Picture Frame — vintage ornate frame for portraits
   ============================================================ */
export function OrnateFrame({
  className = "",
  children,
  color = "#c79a9a",
}: {
  className?: string;
  children?: React.ReactNode;
  color?: string;
}) {
  // unique gradient id to avoid collisions when multiple frames render
  const gid = React.useId().replace(/[:]/g, "");
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 240 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`frame-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#a47575" />
          </linearGradient>
        </defs>
        {/* outer ornate frame */}
        <rect
          x="4"
          y="4"
          width="232"
          height="292"
          rx="16"
          fill={`url(#frame-${gid})`}
        />
        {/* gold trim */}
        <rect
          x="12"
          y="12"
          width="216"
          height="276"
          rx="10"
          fill="none"
          stroke="#e3b23c"
          strokeWidth="1.5"
        />
        {/* inner white mat */}
        <rect
          x="18"
          y="18"
          width="204"
          height="264"
          rx="6"
          fill="#fdf8f0"
        />
        {/* inner photo outline (subtle) */}
        <rect
          x="26"
          y="26"
          width="188"
          height="248"
          rx="4"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        {/* ornate corner swirls */}
        {[
          [16, 16, 0],
          [224, 16, 90],
          [224, 284, 180],
          [16, 284, 270],
        ].map(([cx, cy, rot], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
            <path
              d="M0 0 Q14 -10 28 0 Q20 6 14 2 Q8 6 0 0 Z"
              fill={`url(#frame-${gid})`}
              opacity="0.9"
            />
            <circle cx="10" cy="0" r="2.5" fill="#e3b23c" />
            <circle cx="20" cy="1" r="1.5" fill="#fdf8f0" opacity="0.7" />
          </g>
        ))}
        {/* top crown ornament */}
        <g transform="translate(120 4)">
          <path d="M-22 0 Q0 -16 22 0 Z" fill={`url(#frame-${gid})`} />
          <path d="M-14 0 Q0 -10 14 0 Z" fill="#a47575" opacity="0.6" />
          <circle cx="0" cy="-5" r="3.5" fill="#e3b23c" />
          <circle cx="-10" cy="-2" r="1.8" fill="#fdf8f0" opacity="0.7" />
          <circle cx="10" cy="-2" r="1.8" fill="#fdf8f0" opacity="0.7" />
        </g>
        {/* bottom flourish */}
        <g transform="translate(120 296)">
          <path d="M-20 0 Q0 12 20 0 Z" fill={`url(#frame-${gid})`} />
          <circle cx="0" cy="5" r="3" fill="#e3b23c" />
        </g>
      </svg>
      {/* photo sits inside the white mat */}
      <div className="absolute inset-[26px] z-10 overflow-hidden rounded">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Scalloped Card — wavy scalloped border card (maroon)
   ============================================================ */
export function ScallopedCard({
  className = "",
  children,
  bg = "#a04050",
  border = "#2f3465",
}: {
  className?: string;
  children?: React.ReactNode;
  bg?: string;
  border?: string;
}) {
  const W = 400;
  const H = 600;
  const SCALLOPS = 14;
  const path = React.useMemo(() => scallopedPath(W, H, SCALLOPS), []);
  return (
    <div className={`relative ${className}`}>
      {/* navy scalloped edge behind */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={path} fill={border} />
      </svg>
      {/* maroon inner scalloped (slightly inset) */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)]"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={path} fill={bg} />
      </svg>
      <div className="relative z-10 h-full w-full px-6 py-10 text-center">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Flourish Divider — navy calligraphic flourish with heart
   ============================================================ */
export function FlourishDivider({
  className = "",
  withHeart = true,
}: {
  className?: string;
  withHeart?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 300 50"
      className={className}
      aria-hidden="true"
    >
      {/* left flourish */}
      <path
        d="M10 25 Q60 5 120 25 Q140 30 150 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 25 Q40 35 60 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M30 25 Q45 18 55 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* right flourish (mirrored) */}
      <path
        d="M290 25 Q240 5 180 25 Q160 30 150 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M280 25 Q260 35 240 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M270 25 Q255 18 245 25"
        fill="none"
        stroke="#2f3465"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* center heart */}
      {withHeart && (
        <g transform="translate(150 25)">
          <path
            d="M0 6 C -6 -2 -12 2 -8 8 C -4 14 0 16 0 16 C 0 16 4 14 8 8 C 12 2 6 -2 0 6 Z"
            fill="#a04050"
          />
          <circle cx="-3" cy="6" r="1" fill="#fdf8f0" opacity="0.6" />
        </g>
      )}
    </svg>
  );
}

/* ============================================================
   Wedding Rings — gold interlocking rings
   ============================================================ */
export function WeddingRings({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d574" />
          <stop offset="50%" stopColor="#e3b23c" />
          <stop offset="100%" stopColor="#c89627" />
        </linearGradient>
      </defs>
      <circle
        cx="48"
        cy="40"
        r="28"
        fill="none"
        stroke="url(#ringGold)"
        strokeWidth="6"
      />
      <circle
        cx="72"
        cy="40"
        r="28"
        fill="none"
        stroke="url(#ringGold)"
        strokeWidth="6"
      />
      {/* diamond on left ring */}
      <g transform="translate(48 12)">
        <path d="M-6 0 L0 -8 L6 0 L0 8 Z" fill="#e3b23c" />
        <path d="M-3 0 L0 -4 L3 0 L0 4 Z" fill="#fdf8f0" opacity="0.6" />
      </g>
      {/* shine */}
      <circle cx="38" cy="30" r="3" fill="#fdf8f0" opacity="0.5" />
      <circle cx="62" cy="30" r="3" fill="#fdf8f0" opacity="0.5" />
    </svg>
  );
}

/* ============================================================
   Watercolor Floral — side decoration
   ============================================================ */
export function WatercolorFloral({
  className = "",
  variant = "left",
}: {
  className?: string;
  variant?: "left" | "right";
}) {
  return (
    <svg
      viewBox="0 0 120 240"
      className={className}
      aria-hidden="true"
      style={{ transform: variant === "right" ? "scaleX(-1)" : undefined }}
    >
      {/* stem */}
      <path
        d="M60 240 Q50 180 60 120 Q70 80 60 30"
        fill="none"
        stroke="#7c8a4f"
        strokeWidth="2"
      />
      {/* leaves */}
      <ellipse cx="40" cy="190" rx="14" ry="5" fill="#9caa5e" transform="rotate(-30 40 190)" />
      <ellipse cx="78" cy="160" rx="14" ry="5" fill="#9caa5e" transform="rotate(30 78 160)" />
      <ellipse cx="42" cy="130" rx="12" ry="4" fill="#9caa5e" transform="rotate(-30 42 130)" />
      <ellipse cx="76" cy="100" rx="12" ry="4" fill="#9caa5e" transform="rotate(30 76 100)" />
      {/* flowers */}
      <g transform="translate(58 70)">
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 14}
              cy={Math.sin(a) * 14}
              rx="14"
              ry="8"
              fill="#e88a7d"
              opacity="0.85"
              transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 14} ${Math.sin(a) * 14})`}
            />
          );
        })}
        <circle r="6" fill="#e3b23c" />
      </g>
      <g transform="translate(64 150)">
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 9}
              cy={Math.sin(a) * 9}
              rx="9"
              ry="5"
              fill="#cf9595"
              opacity="0.9"
              transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 9} ${Math.sin(a) * 9})`}
            />
          );
        })}
        <circle r="4" fill="#a04050" />
      </g>
      {/* bud */}
      <g transform="translate(58 200)">
        <ellipse rx="7" ry="11" fill="#e7b8b8" />
        <ellipse rx="3" ry="6" fill="#cf9595" />
      </g>
    </svg>
  );
}

/* ============================================================
   Blob Card — blob-shaped panel with scalloped border (gift)
   ============================================================ */
export function BlobCard({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  // organic blob path with smoother curves
  const blob =
    "M60 18 C 140 4, 260 4, 342 22 C 396 34, 388 90, 380 140 C 374 180, 400 240, 360 312 C 320 360, 240 358, 180 348 C 110 336, 24 332, 14 260 C 4 196, 18 140, 22 100 C 26 60, 30 30, 60 18 Z";
  return (
    <div className={`relative ${className}`}>
      {/* navy blob */}
      <svg
        viewBox="0 0 400 360"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={blob} fill="#2f3465" />
      </svg>
      {/* cream inner with maroon dashed stitched border */}
      <svg
        viewBox="0 0 400 360"
        className="absolute inset-[10px] h-[calc(100%-20px)] w-[calc(100%-20px)]"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={blob}
          fill="#fdf8f0"
          stroke="#a04050"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 h-full w-full px-7 py-8">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Small flower cluster (decorative accents)
   ============================================================ */
export function FlowerCluster({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(30 30)">
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={Math.cos(a) * 10}
              cy={Math.sin(a) * 10}
              rx="10"
              ry="5"
              fill="#e88a7d"
              transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 10} ${Math.sin(a) * 10})`}
            />
          );
        })}
        <circle r="5" fill="#e3b23c" />
      </g>
    </svg>
  );
}

/* ============================================================
   BCA Logo (stylized recreation — blue rounded badge with "BCA")
   ============================================================ */
export function BcaLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 36" className={className} aria-hidden="true">
      <rect width="90" height="36" rx="5" fill="#0b5cab" />
      {/* stylized B */}
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9 L14 27 M14 9 L24 9 Q30 9 30 14 Q30 18 24 18 L14 18 M14 18 L25 18 Q31 18 31 23 Q31 27 25 27 L14 27" />
      </g>
      {/* C */}
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M48 11 Q40 11 40 18 Q40 25 48 25" />
        <path d="M48 11 L48 16" />
        <path d="M48 20 L48 25" />
      </g>
      {/* A */}
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M56 27 L62 11 L68 27 M58.5 21 L65.5 21" />
      </g>
      {/* small leaf accent */}
      <path
        d="M76 14 Q80 11 84 14 Q82 18 78 17 Q76 16 76 14 Z"
        fill="#fff"
        opacity="0.85"
      />
    </svg>
  );
}

/* ============================================================
   SeaBank Logo (stylized wordmark — teal-blue rounded badge)
   ============================================================ */
export function SeabankLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 36" className={className} aria-hidden="true">
      <rect width="110" height="36" rx="8" fill="#0a7ea4" />
      {/* wave accent */}
      <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M11 22.5 Q15.5 17 20 22.5 Q24.5 28 29 22.5" />
        <path d="M14 16.5 Q18.5 11.5 23 16.5" opacity="0.7" />
      </g>
      <text
        x="71"
        y="24"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14.5"
        fontWeight="bold"
        letterSpacing="0.5"
        fill="#fff"
      >
        SeaBank
      </text>
    </svg>
  );
}
