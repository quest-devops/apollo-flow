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
      <path d="M8 0.9 L15.1 15.1 H11.8 L8 7.5 L4.2 15.1 H0.9 Z" fill={color} />
      <path d="M8 9.85 L10.6 15.1 H5.4 Z" fill={color} />
    </IconWrapper>
  );
}
