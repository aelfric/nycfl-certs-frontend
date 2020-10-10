import React from "react";

interface IconProps {
  style: React.CSSProperties;
}

export function Medal({ style }: IconProps) {
  return (
    <svg
      style={style}
      data-name="Layer 1"
      viewBox="0 0 100 125"
      x="0px"
      y="0px"
    >
      <path d="M77.39,60.12l20-32a4,4,0,0,0,.32-3.61l-8-20A4,4,0,0,0,86.32,2a4,4,0,0,0-.6,0,1.69,1.69,0,0,0-.24,0H14l-.12,0a1.34,1.34,0,0,1-.2,0,4.18,4.18,0,0,0-1.17.29l-.24.13a3.63,3.63,0,0,0-.93.63l-.27.26a3.9,3.9,0,0,0-.68,1s-.06.09-.08.14l0,0-8,20a4,4,0,0,0,.32,3.61l20,32a4,4,0,0,0,.87,1,28,28,0,1,0,53,0A4,4,0,0,0,77.39,60.12ZM50,42a27.94,27.94,0,0,0-8.86,1.46L30.67,26H69.33L58.86,43.46A27.94,27.94,0,0,0,50,42ZM74.12,18,74,18H26l-.12,0-4.82-8H78.94ZM10.47,25.6,14.72,15,34,47.07a28.14,28.14,0,0,0-6.29,6.08ZM50,90A20,20,0,1,1,70,70,20,20,0,0,1,50,90ZM66,47.07,85.28,15,89.53,25.6,72.31,53.15A28.14,28.14,0,0,0,66,47.07Z" />
    </svg>
  );
}

export function Trophy({ style }: IconProps) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 125"
    >
      <g>
        <path d="M99.989,10.655c0.073-0.925-0.246-1.839-0.875-2.52c-0.632-0.682-1.518-1.068-2.447-1.068H83.206   c0.074-1.233,0.13-2.475,0.13-3.734C83.336,1.492,81.84,0,80.001,0H20c-1.841,0-3.333,1.492-3.333,3.333   c0,1.26,0.051,2.501,0.127,3.734H3.333c-0.929,0-1.815,0.386-2.446,1.068c-0.63,0.681-0.95,1.595-0.877,2.52   C1.21,26.281,10.723,55.382,37.801,56.923C41.549,62.43,45,68,45,72.501c0,13.787-18.897,20.874-19.09,20.919   c-1.647,0.387-2.746,1.95-2.553,3.631c0.195,1.68,1.615,2.949,3.31,2.949h46.665c0.026-0.002,0.049,0,0.071,0   c1.843,0,3.334-1.489,3.334-3.333c0-1.685-1.247-3.072-2.862-3.299C71.787,92.821,55,85.561,55,72.501   C55,68,58.45,62.43,62.201,56.923C89.28,55.382,98.79,26.281,99.989,10.655z M7.107,13.733h10.465   c2.369,14.145,9.098,26.271,15.268,35.78C13.912,44.931,8.504,22.618,7.107,13.733z M92.897,13.733   c-1.402,8.885-6.811,31.198-25.737,35.78c6.171-9.509,12.898-21.635,15.264-35.78H92.897z" />
      </g>
    </svg>
  );
}

export function Certificate({ style }: IconProps) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 40"
      x="0px"
      y="0px"
    >
      <g data-name="48-Certification">
        <path d="M28.71,6.29l-6-6A1,1,0,0,0,22,0H6A3,3,0,0,0,3,3V25a3,3,0,0,0,3,3h7V26H6a1,1,0,0,1-1-1V3A1,1,0,0,1,6,2H21V6a2,2,0,0,0,2,2h4V25a1,1,0,0,1-1,1H25v2h1a3,3,0,0,0,3-3V7A1,1,0,0,0,28.71,6.29Z" />
        <path d="M19,14a5,5,0,0,0-5,5,5,5,0,0,0,1,3h0v9a1,1,0,0,0,1.71.71L19,29.41l2.29,2.29A1,1,0,0,0,23,31V22h0a5,5,0,0,0,1-3A5,5,0,0,0,19,14Zm2,14.59-1.29-1.29a1,1,0,0,0-1.41,0L17,28.59v-5a4.93,4.93,0,0,0,4,0ZM19,22a3,3,0,1,1,3-3A3,3,0,0,1,19,22Z" />
        <rect x="7" y="4" width="6" height="4" rx="1" ry="1" />
        <rect x="7" y="11" width="8" height="2" />
        <rect x="7" y="15" width="5" height="2" />
        <rect x="7" y="19" width="5" height="2" />
      </g>
    </svg>
  );
}
