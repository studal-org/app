import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/trpc/server";
import UserMenuOnClient from "./client";

const UserMenu: React.FC = async () => {
  const user = await api.user.read.query();
  const student = await api.user.student.read.query();

  return <UserMenuOnClient user={user} student={student} />;
};

export const UserMenuLoading: React.FC = () => (
  <Skeleton className="h-8 w-8 rounded-full" />
);

export default UserMenu;
