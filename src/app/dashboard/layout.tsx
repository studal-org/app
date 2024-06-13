import { ScrollArea } from "@/components/ui/scroll-area";
import { getSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { Suspense, type FC, type ReactNode } from "react";
import DashboardHeader from "./_components/header";
import DashboardNavbar from "./_components/navbar";
import UserMenu, { UserMenuLoading } from "./_components/user-menu";

const DashboardLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const session = await getSession();
  if (!session) redirect("/auth");
  return (
    <div className="min-h-full max-h-full grid grid-rows-[auto_1fr] bg-gradient-to-br from-primary/5 to-primary/20">
      <DashboardHeader>
        <DashboardNavbar />
        <Suspense fallback={<UserMenuLoading />}>
          <UserMenu />
        </Suspense>
      </DashboardHeader>
      <ScrollArea>
        <main className="container my-8">{children}</main>
      </ScrollArea>
    </div>
  );
};

export default DashboardLayout;
