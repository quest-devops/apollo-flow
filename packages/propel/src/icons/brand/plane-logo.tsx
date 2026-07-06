/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

export function PlaneLogo({ width = "52", height = "52", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask id="apollo-mark-ring-cut" maskUnits="userSpaceOnUse" x="-30" y="-10" width="112" height="72">
        <rect x="-30" y="-10" width="112" height="72" fill="white" />
        <polygon points="-25.52,50.15 70.85,1.04 74.04,7.31 -22.33,56.41" fill="black" />
      </mask>
      <mask id="apollo-mark-tongue-cut" maskUnits="userSpaceOnUse" x="-30" y="-50" width="112" height="112">
        <rect x="-30" y="-50" width="112" height="112" fill="white" />
        <polygon points="-49.34,3.41 47.03,-45.7 74.04,7.31 -22.33,56.41" fill="black" />
        <circle cx="15.99" cy="46.75" r="12.84" fill="black" />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.92 27.04 A13.52 13.52 0 1 0 9.88 27.04 A13.52 13.52 0 1 0 36.92 27.04 Z M31.51 27.04 A8.11 8.11 0 1 0 15.29 27.04 A8.11 8.11 0 1 0 31.51 27.04 Z"
        fill={color}
        mask="url(#apollo-mark-ring-cut)"
      />
      <circle cx="23.4" cy="27.04" r="8.11" fill={color} mask="url(#apollo-mark-tongue-cut)" />
      <line x1="31.63" y1="19.36" x2="43.07" y2="13.53" stroke={color} strokeWidth="2.43" strokeLinecap="round" />
      <polygon points="46.77,14.83 34.12,21.27 3.47,38.56 35.47,23.93 48.12,17.48" fill={color} />
      <circle cx="47.44" cy="16.16" r="1.49" fill={color} />
    </svg>
  );
}
