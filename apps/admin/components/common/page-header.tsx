/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

type TPageHeader = {
  title?: string;
  description?: string;
};

export function PageHeader(props: TPageHeader) {
  const { title = "Apollo Admin", description = "Painel administrativo do Apollo" } = props;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  );
}
