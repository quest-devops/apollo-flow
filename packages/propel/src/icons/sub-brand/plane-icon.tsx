/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import { IconWrapper } from "../icon-wrapper";
import type { ISvgIcons } from "../type";

export function PlaneNewIcon({ color = "currentColor", ...rest }: ISvgIcons) {
  return (
    <IconWrapper color={color} {...rest}>
      <mask id="apollo-icon-ring-cut" maskUnits="userSpaceOnUse" x="-10" y="-4" width="36" height="24">
        <rect x="-10" y="-4" width="36" height="24" fill="white" />
        <polygon points="-7.85,15.43 21.8,0.32 22.78,2.25 -6.87,17.36" fill="black" />
      </mask>
      <mask id="apollo-icon-tongue-cut" maskUnits="userSpaceOnUse" x="-16" y="-16" width="42" height="36">
        <rect x="-16" y="-16" width="42" height="36" fill="white" />
        <polygon points="-15.18,1.05 14.47,-14.06 22.78,2.25 -6.87,17.36" fill="black" />
        <circle cx="4.92" cy="14.38" r="3.95" fill="black" />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.36 8.32 A4.16 4.16 0 1 0 3.04 8.32 A4.16 4.16 0 1 0 11.36 8.32 Z M9.7 8.32 A2.5 2.5 0 1 0 4.7 8.32 A2.5 2.5 0 1 0 9.7 8.32 Z"
        fill={color}
        mask="url(#apollo-icon-ring-cut)"
      />
      <circle cx="7.2" cy="8.32" r="2.5" fill={color} mask="url(#apollo-icon-tongue-cut)" />
      <line x1="9.73" y1="5.96" x2="13.25" y2="4.16" stroke={color} strokeWidth="0.75" strokeLinecap="round" />
      <polygon points="14.39,4.56 10.5,6.55 1.07,11.86 10.91,7.36 14.81,5.38" fill={color} />
      <circle cx="14.6" cy="4.97" r="0.46" fill={color} />
    </IconWrapper>
  );
}
