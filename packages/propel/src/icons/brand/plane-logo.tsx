/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

// Símbolo ApolloPlan (3 barras ascendentes — kit final/apps/apolloplan).
// Herda a cor via prop `color` (currentColor).
export function PlaneLogo({ width = "52", height = "52", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill={color}>
        <rect x="132" y="132" width="207" height="402" rx="48" ry="48" />
        <rect x="408" y="132" width="207" height="581" rx="48" ry="48" />
        <rect x="684" y="132" width="207" height="759" rx="48" ry="48" />
      </g>
    </svg>
  );
}
