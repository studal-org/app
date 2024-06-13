import { api } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { type FC, type ReactNode } from "react";

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  try {
    await api.user.admin.read();
    return <>{children}</>;
  } catch (error) {
    if (error instanceof TRPCError) {
      const code = error.code;
      if (["NOT_FOUND", "UNAUTHORIZED"].some((v) => v === code))
        redirect("/dashboard");
    }
    throw error;
  }
};

export default AdminLayout;
