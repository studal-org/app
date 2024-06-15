import { env } from "@/env";
import { type NextRequest } from "next/server";
import { type FC, type HTMLAttributes } from "react";
import vkAuthProvider from "./vk";

export type AuthProvider = {
  id: string;
  title: string;
  Icon: FC<HTMLAttributes<HTMLOrSVGElement>>;
  generateRedirectURL: (options: {
    request: NextRequest;
    state?: string;
    callbackUrl?: string;
  }) => string;
  callback: (options: { request: NextRequest }) => Promise<{
    id: string;
    title: string;
    image: string;
  }>;
};

const ssoAuthProviders = [vkAuthProvider] satisfies AuthProvider[];

const baseSsoUrl = `${env.APP_URL}/auth/sso` as const;

export const generateRedirectURL = <ProviderId extends string>(
  providerId: ProviderId,
) => `${baseSsoUrl}/${providerId}/redirect` as const;

export const generateCallbackURL = <ProviderId extends string>(
  providerId: ProviderId,
) => `${baseSsoUrl}/${providerId}/callback` as const;

export class SsoAuthInvalidPayload extends Error {
  constructor() {
    super("Invalid Payload");
  }
}

export class SsoAuthUuidMismatch extends Error {
  constructor() {
    super("UUID Mismatch");
  }
}

export class SsoAuthCouldNotGetAccountInfo extends Error {
  constructor() {
    super("Could Not Get Account Info");
  }
}

export default ssoAuthProviders;
