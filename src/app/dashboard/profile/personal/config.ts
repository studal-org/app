import { User } from "lucide-react";
import { type ProfilePageConfig } from "../config";

const personalPageConfig = {
  id: "personal" as const,
  title: "Персональная информация",
  Icon: User,
} satisfies ProfilePageConfig;

export default personalPageConfig;
