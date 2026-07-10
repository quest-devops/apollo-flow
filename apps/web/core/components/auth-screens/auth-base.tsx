/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import { AuthRoot } from "@/components/account/auth-forms/auth-root";
import type { EAuthModes } from "@/helpers/authentication.helper";
// Fundo de login Apollo (grade CRT) — compartilhado com o admin e o Cloud
import ApolloLoginBg from "@/app/assets/auth/apollo-login-bg.webp?url";
import { AuthFooter } from "./footer";
import { AuthHeader } from "./header";

type AuthBaseProps = {
  authType: EAuthModes;
};

// scrim escuro sobre a grade p/ legibilidade do formulário
const authBackgroundStyle: React.CSSProperties = {
  backgroundImage: `linear-gradient(rgba(20, 20, 20, 0.55), rgba(20, 20, 20, 0.55)), url(${ApolloLoginBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export function AuthBase({ authType }: AuthBaseProps) {
  return (
    <div
      className="relative z-10 flex h-screen w-screen flex-col items-center overflow-hidden overflow-y-auto px-8 pt-6 pb-10"
      style={authBackgroundStyle}
    >
      <AuthHeader type={authType} />
      <AuthRoot authMode={authType} />
      <AuthFooter />
    </div>
  );
}
