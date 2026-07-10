/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, type CSSProperties } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { Outlet } from "react-router";
// hooks
import { useUser } from "@/hooks/store/use-user";
// Fundo de login Apollo (grade CRT) — compartilhado com o web e o Cloud
import ApolloLoginBg from "@/app/assets/auth/apollo-login-bg.webp?url";

// scrim escuro sobre a grade p/ legibilidade do formulário
const authBackgroundStyle: CSSProperties = {
  backgroundImage: `linear-gradient(rgba(20, 20, 20, 0.55), rgba(20, 20, 20, 0.55)), url(${ApolloLoginBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

function RootLayout() {
  // router
  const { replace } = useRouter();
  // store hooks
  const { isUserLoggedIn } = useUser();

  useEffect(() => {
    if (isUserLoggedIn === true) replace("/general");
  }, [replace, isUserLoggedIn]);

  return (
    <div
      className="relative z-10 flex h-screen w-screen flex-col items-center overflow-hidden overflow-y-auto bg-surface-1 px-8 pt-6 pb-10"
      style={authBackgroundStyle}
    >
      <Outlet />
    </div>
  );
}

export default observer(RootLayout);
