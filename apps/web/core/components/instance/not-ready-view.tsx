/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { GOD_MODE_URL } from "@plane/constants";
import DefaultLayout from "@/layouts/default-layout";
import { PlaneLogo, PlaneLockup } from "@plane/propel/icons";
import { Button } from "@plane/propel/button";

export function InstanceNotReady() {
  return (
    <DefaultLayout>
      <div className="relative z-10 flex h-screen w-screen overflow-hidden">
        {/* Main content */}
        <div className="flex h-full w-full flex-col items-center px-8 pt-6 pb-10">
          <div className="sticky top-0 flex w-full shrink-0 items-center justify-between gap-6">
            <PlaneLockup height={20} width={95} className="text-accent-primary" />
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center gap-7">
            <div className="flex flex-col items-center gap-11">
              <PlaneLogo height={88} width={88} className="text-accent-primary" />
              <div className="flex max-w-124 flex-col items-center gap-3">
                <h1 className="text-h2-semibold text-primary">Bem-vindo ao Apollo</h1>
                <p className="text-center text-body-md-regular text-secondary">
                  Configure a instância e crie o primeiro workspace para começar a gerenciar projetos e trabalho.
                </p>
              </div>
            </div>
            <a href={GOD_MODE_URL} className="w-72">
              <Button variant="primary" className="w-full" size="xl">
                Começar
              </Button>
            </a>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
