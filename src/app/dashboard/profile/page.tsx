import { redirect } from "next/navigation";
import { type FC } from "react";

const DashboardProfilePage: FC = () => {
  redirect("/dashboard/profile/personal");
};

export default DashboardProfilePage;
