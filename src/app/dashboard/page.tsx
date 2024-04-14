import { getSession } from "@/server/auth/session";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  const session = await getSession();
  if (!session) redirect("/auth");
  const student = await api.user.student.read();
  if (student) redirect("/dashboard/student");
  if ("admin" in session) redirect("/dashboard/admin");
  redirect("/");
};

export default DashboardPage;
