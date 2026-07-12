/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// Apollo: white-label — a página "Billing & Plans" do fornecedor foi removida
// (o item também saiu do menu de configurações). Acesso direto redireciona
// para as configurações gerais do workspace.
import { redirect } from "react-router";

export const clientLoader = ({ params }: { params: { workspaceSlug?: string } }) => {
  throw redirect(`/${params.workspaceSlug}/settings`);
};

export default function BillingSettingsPage() {
  return null;
}
