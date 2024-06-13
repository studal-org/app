import { api } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

const processUnauthorized = async <T,>(p: Promise<T>) => {
  try {
    return await p;
  } catch (error) {
    if (
      !(
        error instanceof TRPCError &&
        ["NOT_FOUND", "UNAUTHORIZED"].some((v) => v === error.code)
      )
    )
      throw error;
  }
};

const DashboardPage: React.FC = async () => {
  const checkStudent = async () => {
    await api.user.student.read();
    redirect("/dashboard/student");
  };

  const checkAdmin = async () => {
    await api.user.admin.read();
    redirect("/dashboard/admin");
  };

  await processUnauthorized(checkStudent());
  await processUnauthorized(checkAdmin());

  redirect("/");
};

export default DashboardPage;
