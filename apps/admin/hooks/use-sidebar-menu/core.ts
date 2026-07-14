/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Image, BrainCog, Cog, Mail } from "lucide-react";
// plane imports
import { LockIcon, WorkspaceIcon } from "@plane/propel/icons";
// types
import type { TSidebarMenuItem } from "./types";

export type TCoreSidebarMenuKey = "general" | "email" | "workspace" | "authentication" | "ai" | "image";

export const coreSidebarMenuLinks: Record<TCoreSidebarMenuKey, TSidebarMenuItem> = {
  general: {
    Icon: Cog,
    name: "Geral",
    description: "Identifique sua instância e veja os detalhes principais.",
    href: `/general/`,
  },
  email: {
    Icon: Mail,
    name: "E-mail",
    description: "Configure o envio de e-mail (SMTP).",
    href: `/email/`,
  },
  workspace: {
    Icon: WorkspaceIcon,
    name: "Workspaces",
    description: "Gerencie todos os workspaces desta instância.",
    href: `/workspace/`,
  },
  authentication: {
    Icon: LockIcon,
    name: "Autenticação",
    description: "Configure os métodos de autenticação.",
    href: `/authentication/`,
  },
  ai: {
    Icon: BrainCog,
    name: "Inteligência artificial",
    description: "Configure suas credenciais da OpenAI.",
    href: `/ai/`,
  },
  image: {
    Icon: Image,
    name: "Imagens no Apollo",
    description: "Permita bibliotecas de imagens de terceiros.",
    href: `/image/`,
  },
};
