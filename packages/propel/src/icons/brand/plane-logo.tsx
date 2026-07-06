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
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M26 3 L49 49 H38.2 L26 24.4 L13.8 49 H3 Z" fill={color} />
      <path d="M26 32 L34.5 49 H17.5 Z" fill={color} />
    </svg>
  );
}
