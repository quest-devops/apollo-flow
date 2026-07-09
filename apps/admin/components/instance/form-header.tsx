/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export function FormHeader({ heading, subHeading }: { heading: string; subHeading: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="apollo-display apollo-glow text-[2.5rem] leading-none text-accent-primary">{heading}</span>
      <span className="text-13 leading-6 text-placeholder tracking-wide uppercase">
        <span className="text-accent-primary">&gt;</span> {subHeading}
      </span>
    </div>
  );
}
