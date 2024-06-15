import { VkIcon } from "@/components/icons";
import { env } from "@/env";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import { ulid } from "ulidx";
import { ZodError, z } from "zod";
import {
  SsoAuthCouldNotGetAccountInfo,
  SsoAuthInvalidPayload,
  SsoAuthUuidMismatch,
  generateCallbackURL,
  type AuthProvider,
} from "../index";

const uuidCookieName = "VKID_UUID";

const payloadSchema = z.object({
  auth: z.union([z.literal(0), z.literal(1)]),
  token: z.string(),
  ttl: z.number(),
  type: z.literal("silent_token"),
  uuid: z.string(),
});

const processPayloadString = (payloadString: string) => {
  try {
    const payload = payloadSchema.parse(JSON.parse(payloadString));
    return payload;
  } catch (error) {
    if ([SyntaxError, ZodError].some((errorType) => error instanceof errorType))
      throw SsoAuthInvalidPayload;
    throw error;
  }
};

const accountInfoResponseDataSchema = z.object({
  response: z.object({
    success: z.array(
      z.object({
        token: z.string(),
        expires: z.number(),
        first_name: z.string(),
        last_name: z.string(),
        user_id: z.number(),
        photo_50: z.string().url(),
        photo_100: z.string().url(),
        photo_200: z.string().url(),
      }),
    ),
    errors: z.array(
      z.object({
        token: z.string(),
        code: z.number(),
        description: z.string(),
      }),
    ),
  }),
});

const processAccountInfoResponseData = (accountInfoResponseData: unknown) => {
  try {
    const payload = accountInfoResponseDataSchema.parse(
      accountInfoResponseData,
    );
    return payload;
  } catch (error) {
    if (error instanceof ZodError) throw SsoAuthCouldNotGetAccountInfo;
    throw error;
  }
};

const vkAuthProvider = {
  id: "vkid" as const,
  title: "VK ID" as const,
  Icon: VkIcon,
  generateRedirectURL: ({ state = "undefined", callbackUrl }) => {
    const uuid = ulid();
    const expires = DateTime.now().plus({ minutes: 5 }).toJSDate();
    cookies().set(uuidCookieName, uuid, {
      expires,
      secure: env.APP_PROTOCOL === "https" ? true : false,
      sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
      domain: env.APP_DOMAIN,
      httpOnly: true,
    });

    const baseUrl = "https://id.vk.com/auth";
    const searchParams = new URLSearchParams({
      app_id: env.AUTH_SSO_VKID_ID,
      response_type: "silent_token",
      redirect_uri: callbackUrl ?? generateCallbackURL("vkid"),
      redirect_state: state,
      uuid,
    });
    return `${baseUrl}?${searchParams.toString()}`;
  },
  callback: async ({ request }) => {
    const payloadString = request.nextUrl.searchParams.get("payload");
    if (!payloadString) throw SsoAuthInvalidPayload;

    const { uuid, token } = processPayloadString(payloadString);

    const uuidCookie = cookies().get(uuidCookieName)?.value;
    if (!uuidCookie || uuidCookie !== uuid) throw SsoAuthUuidMismatch;

    const baseUrl =
      "https://api.vk.com/method/auth.getProfileInfoBySilentToken";
    const searchParams = new URLSearchParams({
      v: "5.108",
      access_token: env.AUTH_SSO_VKID_SECRET,
      token,
      uuid,
      event: "",
    });

    const accountInfoResponse = await fetch(
      `${baseUrl}?${searchParams.toString()}`,
    );
    const accountInfoResponseData = processAccountInfoResponseData(
      await accountInfoResponse.json(),
    );

    const accountInfo = accountInfoResponseData.response.success.at(0);
    if (!accountInfo || accountInfo.token !== token)
      throw SsoAuthCouldNotGetAccountInfo;

    const { user_id, first_name, last_name, photo_200 } = accountInfo;

    return {
      id: user_id.toString(),
      title: `${first_name} ${last_name}`,
      image: photo_200,
    };
  },
} satisfies AuthProvider;

export default vkAuthProvider;
