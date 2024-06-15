import { getSession } from "@/server/auth/session";
import { type FC } from "react";

const ProfilePersonalPage: FC = async () => {
  const session = await getSession();
  return <div className=""></div>;
};

export default ProfilePersonalPage;
