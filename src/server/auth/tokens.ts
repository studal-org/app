import { env } from "@/env";
import * as jose from "jose";
import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export type TokenPayload = {
  sub: string;
  iat: Date;
  nbf: Date;
  exp: Date;
  jti: string;
};

export type IncomingTokenPayload = {
  sub: string;
  iat: number;
  nbf: number;
  exp: number;
  jti: string;
};

export const checkIncomingPayload = (
  payload: object,
): payload is IncomingTokenPayload => {
  return (
    "sub" in payload &&
    typeof payload.sub === "string" &&
    "iat" in payload &&
    typeof payload.iat === "number" &&
    "nbf" in payload &&
    typeof payload.nbf === "number" &&
    "exp" in payload &&
    typeof payload.exp === "number" &&
    "jti" in payload &&
    typeof payload.jti === "string"
  );
};

const transformIncomingPayload = (
  payload: IncomingTokenPayload,
): TokenPayload => ({
  ...payload,
  iat: new Date(payload.iat),
  nbf: new Date(payload.nbf),
  exp: new Date(payload.exp),
});

export const sessionTokenController = {
  alg: "HS256" as const,
  tokenName: "session" as const,
  generateCookieOptions: (exp: Date): Partial<ResponseCookie> => ({
    expires: exp,
    secure: env.APP_PROTOCOL === "https" ? true : false,
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    domain: env.APP_DOMAIN,
    httpOnly: true,
  }),
  newToken({ sub, iat, nbf, exp, jti }: TokenPayload) {
    return new jose.SignJWT()
      .setProtectedHeader({ alg: this.alg })
      .setSubject(sub)
      .setIssuedAt(iat)
      .setNotBefore(nbf)
      .setJti(jti)
      .setExpirationTime(exp);
  },

  async set(payload: TokenPayload) {
    const token = await this.newToken(payload).sign(env.SESSION_SECRET);
    console.log(this.generateCookieOptions(payload.exp));
    cookies().set(
      this.tokenName,
      token,
      this.generateCookieOptions(payload.exp),
    );
    return { payload, token };
  },
  async get() {
    const cookie = cookies().get(this.tokenName);
    if (!cookie) return { payload: undefined, token: undefined };
    const token = cookie.value;
    try {
      const { payload } = await jose.jwtVerify(token, env.SESSION_SECRET, {
        algorithms: [this.alg],
      });
      if (!checkIncomingPayload(payload)) return this.destroy();
      return { payload: transformIncomingPayload(payload), token };
    } catch (error) {
      if (
        [
          jose.errors.JWTExpired,
          jose.errors.JWTInvalid,
          jose.errors.JWSSignatureVerificationFailed,
        ].some((errorType) => error instanceof errorType)
      )
        return this.destroy();
      throw error;
    }
  },
  destroy() {
    cookies().delete(this.tokenName);
    return { payload: undefined, token: undefined };
  },
};
