/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import type { ISvgIcons } from "../type";

// Símbolo Apollo Operation (burst orbital). Herda a cor via prop `color` (currentColor).
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
      <g fill={color} transform="translate(1024,0) scale(-1,1)"><ellipse cx="512.00" cy="226.00" rx="166.00" ry="15.00" transform="rotate(90.00 512.00 226.00)"/><ellipse cx="367.18" cy="261.17" rx="157.82" ry="18.00" transform="rotate(60.00 367.18 261.17)"/><ellipse cx="258.02" cy="365.36" rx="149.64" ry="21.00" transform="rotate(30.00 258.02 365.36)"/><ellipse cx="215.09" cy="512.00" rx="141.45" ry="24.00" transform="rotate(0.00 215.09 512.00)"/><ellipse cx="251.72" cy="662.27" rx="133.27" ry="27.00" transform="rotate(-30.00 251.72 662.27)"/><ellipse cx="359.91" cy="775.43" rx="125.09" ry="30.00" transform="rotate(-60.00 359.91 775.43)"/><ellipse cx="512.00" cy="819.82" rx="116.91" ry="33.00" transform="rotate(-90.00 512.00 819.82)"/><ellipse cx="667.73" cy="781.73" rx="108.73" ry="36.00" transform="rotate(-120.00 667.73 781.73)"/><ellipse cx="784.88" cy="669.55" rx="100.55" ry="39.00" transform="rotate(-150.00 784.88 669.55)"/><ellipse cx="830.73" cy="512.00" rx="92.36" ry="42.00" transform="rotate(-180.00 830.73 512.00)"/><ellipse cx="791.18" cy="350.82" rx="84.18" ry="45.00" transform="rotate(-210.00 791.18 350.82)"/><ellipse cx="675.00" cy="229.68" rx="76.00" ry="48.00" transform="rotate(-240.00 675.00 229.68)"/></g>
    </svg>
  );
}
