import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { Suspense, type FC, type ReactNode } from "react";
import DashboardHeader from "../_components/header";
import StudentNavbar from "./_components/navbar";
import UserMenu, { UserMenuLoading } from "./_components/user-menu";

const StudentLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  try {
    await api.user.student.read();
    return (
      <div className="min-h-full grid grid-rows-[auto_1fr] bg-gradient-to-br from-primary/5 to-primary/20">
        <DashboardHeader className="border-b backdrop-blur-3xl bg-background/40">
          <StudentNavbar />
          <Suspense fallback={<UserMenuLoading />}>
            <UserMenu />
          </Suspense>
        </DashboardHeader>
        <main className="container mt-8">{children}</main>
      </div>
    );
  } catch (error) {
    if (error instanceof TRPCClientError && error.cause instanceof TRPCError) {
      const code = error.cause.code;
      if (["NOT_FOUND", "UNAUTHORIZED"].some((v) => v === code))
        redirect("/dashboard");
    }
    throw error;
  }
};

export default StudentLayout;
