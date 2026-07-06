/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

export function PlaneLockup({ width = "253", height = "53", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 253 53"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(0 3) scale(0.9)">
        <path d="M26 3 L49 49 H38.2 L26 24.4 L13.8 49 H3 Z" fill={color} />
        <path d="M26 32 L34.5 49 H17.5 Z" fill={color} />
      </g>
      <text
        x="60"
        y="39"
        fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
        fontSize="32"
        fontWeight="700"
        letterSpacing="3"
        fill={color}
      >
        APOLLO
      </text>
    </svg>
  );
}
