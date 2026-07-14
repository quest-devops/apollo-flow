/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// ui
import { Tooltip } from "@plane/propel/tooltip";
// hooks
import { usePlatformOS } from "@/hooks/use-platform-os";
import packageJson from "package.json";

// Apollo: white-label — o badge deixa de abrir o modal de upgrade do
// fornecedor; vira um selo informativo com a versão no tooltip.
export const WorkspaceEditionBadge = observer(function WorkspaceEditionBadge() {
  // platform
  const { isMobile } = usePlatformOS();

  return (
    <Tooltip tooltipContent={`Versão: v${packageJson.version}`} isMobile={isMobile}>
      <div className="w-fit cursor-default rounded-md bg-layer-2 px-3 py-1.5 text-13 font-medium text-tertiary">
        ApolloPlan
      </div>
    </Tooltip>
  );
});
