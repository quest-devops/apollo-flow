/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { isEmpty } from "lodash-es";
import Link from "next/link";
import { useForm } from "react-hook-form";
// plane internal packages
import { API_BASE_URL } from "@plane/constants";
import { Button, getButtonStyling } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import type { IFormattedInstanceConfiguration, TInstanceApolloAuthenticationConfigurationKeys } from "@plane/types";
// components
import { CodeBlock } from "@/components/common/code-block";
import { ConfirmDiscardModal } from "@/components/common/confirm-discard-modal";
import type { TControllerInputFormField } from "@/components/common/controller-input";
import { ControllerInput } from "@/components/common/controller-input";
import type { TControllerSwitchFormField } from "@/components/common/controller-switch";
import { ControllerSwitch } from "@/components/common/controller-switch";
import type { TCopyField } from "@/components/common/copy-field";
import { CopyField } from "@/components/common/copy-field";
// hooks
import { useInstance } from "@/hooks/store";

type Props = {
  config: IFormattedInstanceConfiguration;
};

type ApolloConfigFormValues = Record<TInstanceApolloAuthenticationConfigurationKeys, string>;

export function InstanceApolloConfigForm(props: Props) {
  const { config } = props;
  // states
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);
  // store hooks
  const { updateInstanceConfigurations } = useInstance();
  // form data
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApolloConfigFormValues>({
    defaultValues: {
      APOLLO_ISSUER_URL: config["APOLLO_ISSUER_URL"],
      APOLLO_CLIENT_ID: config["APOLLO_CLIENT_ID"],
      APOLLO_CLIENT_SECRET: config["APOLLO_CLIENT_SECRET"],
      ENABLE_APOLLO_SYNC: config["ENABLE_APOLLO_SYNC"] || "0",
      APOLLO_WORKSPACE_SLUG: config["APOLLO_WORKSPACE_SLUG"],
    },
  });

  const originURL = !isEmpty(API_BASE_URL) ? API_BASE_URL : typeof window !== "undefined" ? window.location.origin : "";

  const APOLLO_FORM_FIELDS: TControllerInputFormField[] = [
    {
      key: "APOLLO_ISSUER_URL",
      type: "text",
      label: "Issuer URL",
      description: (
        <>
          A Issuer URL (OIDC) do seu provedor Apollo Autentikey. O discovery acontece em{" "}
          <CodeBlock darkerShade>&lt;issuer&gt;/.well-known/openid-configuration</CodeBlock>.
        </>
      ),
      placeholder: "https://auth.example.com/application/o/operation/",
      error: Boolean(errors.APOLLO_ISSUER_URL),
      required: true,
    },
    {
      key: "APOLLO_CLIENT_ID",
      type: "text",
      label: "Client ID",
      description: <>Você obtém isto nas configurações do seu provedor OAuth2/OIDC Apollo Autentikey.</>,
      placeholder: "70a44354520df8bd9bcd",
      error: Boolean(errors.APOLLO_CLIENT_ID),
      required: true,
    },
    {
      key: "APOLLO_CLIENT_SECRET",
      type: "password",
      label: "Client secret",
      description: <>Seu Client secret também fica nas configurações do seu provedor OAuth2/OIDC Apollo Autentikey.</>,
      placeholder: "9b0050f94ec1b744e32ce79ea4ffacd40d4119cb",
      error: Boolean(errors.APOLLO_CLIENT_SECRET),
      required: true,
    },
    {
      key: "APOLLO_WORKSPACE_SLUG",
      type: "text",
      label: "Slug do workspace",
      description: (
        <>
          Slug do workspace ao qual os usuários são adicionados a cada login no Apollo, com o papel vindo do provedor
          de identidade (claim de role). Deixe vazio para não sincronizar papéis.
        </>
      ),
      placeholder: "apollo",
      error: Boolean(errors.APOLLO_WORKSPACE_SLUG),
      required: false,
    },
  ];

  const APOLLO_FORM_SWITCH_FIELD: TControllerSwitchFormField<ApolloConfigFormValues> = {
    name: "ENABLE_APOLLO_SYNC",
    label: "Apollo Autentikey",
  };

  const APOLLO_SERVICE_FIELD: TCopyField[] = [
    {
      key: "Callback_URI",
      label: "Callback URI",
      url: `${originURL}/auth/apollo/callback/`,
      description: (
        <>
          Geramos isto automaticamente. Cole no campo <CodeBlock darkerShade>Redirect URIs</CodeBlock> do seu provedor
          OAuth2/OIDC Apollo Autentikey.
        </>
      ),
    },
  ];

  const onSubmit = async (formData: ApolloConfigFormValues) => {
    const payload: Partial<ApolloConfigFormValues> = { ...formData };

    try {
      const response = await updateInstanceConfigurations(payload);
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Pronto!",
        message: "A autenticação Apollo foi configurada. Recomendamos testá-la agora.",
      });
      reset({
        APOLLO_ISSUER_URL: response.find((item) => item.key === "APOLLO_ISSUER_URL")?.value,
        APOLLO_CLIENT_ID: response.find((item) => item.key === "APOLLO_CLIENT_ID")?.value,
        APOLLO_CLIENT_SECRET: response.find((item) => item.key === "APOLLO_CLIENT_SECRET")?.value,
        ENABLE_APOLLO_SYNC: response.find((item) => item.key === "ENABLE_APOLLO_SYNC")?.value,
        APOLLO_WORKSPACE_SLUG: response.find((item) => item.key === "APOLLO_WORKSPACE_SLUG")?.value,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isDirty) {
      e.preventDefault();
      setIsDiscardChangesModalOpen(true);
    }
  };

  return (
    <>
      <ConfirmDiscardModal
        isOpen={isDiscardChangesModalOpen}
        onDiscardHref="/authentication"
        handleClose={() => setIsDiscardChangesModalOpen(false)}
      />
      <div className="flex flex-col gap-8">
        <div className="grid w-full grid-cols-2 gap-x-12 gap-y-8">
          <div className="col-span-2 flex flex-col gap-y-4 pt-1 md:col-span-1">
            <div className="pt-2.5 text-18 font-medium">Dados do Apollo Autentikey para o Apollo</div>
            {APOLLO_FORM_FIELDS.map((field) => (
              <ControllerInput
                key={field.key}
                control={control}
                type={field.type}
                name={field.key}
                label={field.label}
                description={field.description}
                placeholder={field.placeholder}
                error={field.error}
                required={field.required}
              />
            ))}
            <ControllerSwitch control={control} field={APOLLO_FORM_SWITCH_FIELD} />
            <div className="flex flex-col gap-1 pt-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={(e) => void handleSubmit(onSubmit)(e)}
                  loading={isSubmitting}
                  disabled={!isDirty}
                >
                  {isSubmitting ? "Salvando" : "Salvar alterações"}
                </Button>
                <Link href="/authentication" className={getButtonStyling("secondary", "lg")} onClick={handleGoBack}>
                  Voltar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col gap-y-4 rounded-lg bg-layer-1 px-6 pt-1.5 pb-4">
              <div className="pt-2 text-18 font-medium">Dados do Apollo para o Apollo Autentikey</div>
              {APOLLO_SERVICE_FIELD.map((field) => (
                <CopyField key={field.key} label={field.label} url={field.url} description={field.description} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
