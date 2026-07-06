/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export function LogoSpinner() {
  return (
    <div className="flex items-center justify-center text-accent-primary">
      <svg viewBox="0 0 52 52" className="h-8 w-8 animate-spin sm:h-12 sm:w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="22" stroke="currentColor" strokeOpacity="0.2" strokeWidth="5" />
        <path d="M26 4 A22 22 0 0 1 48 26" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
