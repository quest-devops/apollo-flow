/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

export function PlaneWordmark({ width = "146", height = "44", className, color = "currentColor" }: ISvgIcons) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 146 44"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="2"
        y="31"
        fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
        fontSize="28"
        fontWeight="700"
        letterSpacing="2.5"
        fill={color}
      >
        APOLLO
      </text>
    </svg>
  );
}
