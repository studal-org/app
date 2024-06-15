import { type LucideIcon } from "lucide-react";
import { type Route } from "next";
import personalPageConfig from "./personal/config";
import ssoPageConfig from "./sso/config";

export type ProfilePageConfig = {
  id: string;
  title: string;
  Icon: LucideIcon;
};

export const basePath = "/dashboard/profile" as Route;
const config = [
  personalPageConfig,
  ssoPageConfig,
] satisfies ProfilePageConfig[];

export default config;
