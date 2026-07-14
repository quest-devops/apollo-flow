/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import Link from "next/link";
// ui
import { Button, getButtonStyling } from "@plane/propel/button";
// icons
import { PlaneLogo } from "@plane/propel/icons";
// hooks
import { useTheme } from "@/hooks/store";

export const NewUserPopup = observer(function NewUserPopup() {
  // hooks
  const { isNewUserPopup, toggleNewUserPopup } = useTheme();

  if (!isNewUserPopup) return <></>;
  return (
    <div className="shadow-md absolute right-8 bottom-8 w-96 rounded-lg border border-subtle bg-surface-1 p-6">
      <div className="flex gap-4">
        <div className="grow">
          <div className="text-14 font-semibold">Criar workspace</div>
          <div className="py-2 text-13 font-medium text-tertiary">
            Instância configurada! Bem-vindo ao portal de administração do Apollo. Comece criando seu primeiro
            workspace.
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Link href="/workspace/create" className={getButtonStyling("primary", "lg")}>
              Criar workspace
            </Link>
            <Button variant="secondary" size="lg" onClick={toggleNewUserPopup}>
              Fechar
            </Button>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-center">
          <PlaneLogo height={56} width={56} className="text-accent-primary" />
        </div>
      </div>
    </div>
  );
});
