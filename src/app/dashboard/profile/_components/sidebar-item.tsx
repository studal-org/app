"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC, type ReactNode } from "react";
import { basePath } from "../config";

const DashboardProfileSidebarItem: FC<{
  dashboardProfileSidebarItem: {
    id: string;
    title: string;
    icon: ReactNode;
  };
}> = ({ dashboardProfileSidebarItem: { id, title, icon } }) => {
  const href = `${basePath}/${id}` as Route;
  const pathname = usePathname();

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "justify-start w-full",
          pathname === href
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
        )}
      >
        {icon} {title}
      </Button>
    </Link>
  );
};

export default DashboardProfileSidebarItem;
