/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export function FormHeader({ heading, subHeading }: { heading: string; subHeading: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-h2-bold text-accent-primary">{heading}</span>
      <span className="text-16 leading-6 font-semibold text-placeholder">{subHeading}</span>
    </div>
  );
}
