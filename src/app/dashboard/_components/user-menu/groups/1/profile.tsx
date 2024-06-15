"use client";

import { User } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const useProfile = () => {
  const item = (
    <DropdownMenuItem asChild>
      <Link href="/dashboard/profile">
        <User className="mr-2 h-4 w-4" />
        <span>Профиль</span>
      </Link>
    </DropdownMenuItem>
  );

  return { item, components: [] };
};

export default useProfile;
