import { Puzzle } from "lucide-react";
import { type ProfilePageConfig } from "../config";

const ssoPageConfig = {
  id: "sso" as const,
  title: "Связь с аккаунтами",
  Icon: Puzzle,
} satisfies ProfilePageConfig;

export default ssoPageConfig;
