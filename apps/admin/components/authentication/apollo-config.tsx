/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import Link from "next/link";
// icons
import { Settings2 } from "lucide-react";
// plane internal packages
import { getButtonStyling } from "@plane/propel/button";
import type { TInstanceAuthenticationMethodKeys } from "@plane/types";
import { ToggleSwitch } from "@plane/ui";
import { cn } from "@plane/utils";
// hooks
import { useInstance } from "@/hooks/store";

type Props = {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
};

export const ApolloConfiguration = observer(function ApolloConfiguration(props: Props) {
  const { disabled, updateConfig } = props;
  // store
  const { formattedConfig } = useInstance();
  // derived values
  const ApolloConfig = formattedConfig?.IS_APOLLO_ENABLED ?? "";
  const ApolloConfigured =
    !!formattedConfig?.APOLLO_ISSUER_URL &&
    !!formattedConfig?.APOLLO_CLIENT_ID &&
    !!formattedConfig?.APOLLO_CLIENT_SECRET;

  return (
    <>
      {ApolloConfigured ? (
        <div className="flex items-center gap-4">
          <Link href="/authentication/apollo" className={cn(getButtonStyling("link", "base"), "font-medium")}>
            Editar
          </Link>
          <ToggleSwitch
            value={Boolean(parseInt(ApolloConfig))}
            onChange={() => {
              Boolean(parseInt(ApolloConfig)) === true
                ? updateConfig("IS_APOLLO_ENABLED", "0")
                : updateConfig("IS_APOLLO_ENABLED", "1");
            }}
            size="sm"
            disabled={disabled}
          />
        </div>
      ) : (
        <Link href="/authentication/apollo" className={cn(getButtonStyling("secondary", "base"), "text-tertiary")}>
          <Settings2 className="h-4 w-4 p-0.5 text-tertiary" />
          Configurar
        </Link>
      )}
    </>
  );
});
