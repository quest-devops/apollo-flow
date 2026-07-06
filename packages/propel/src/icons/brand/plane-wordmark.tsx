/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";

import { PlaneLockup } from "./plane-lockup";
import type { ISvgIcons } from "../type";

export function PlaneWordmark(props: ISvgIcons) {
  return <PlaneLockup {...props} />;
}
