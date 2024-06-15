import { getSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { type FC } from "react";
import AdminEducationalResources from "./_components/educational_resources";

const AdminPage: FC = async () => {
  const session = await getSession();

  if (!session) redirect("/dashboard");

  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Добро пожаловать, {session.user.firstName}
      </h1>
      <div className="mt-4">
        <AdminEducationalResources />
      </div>
    </div>
  );
};

export default AdminPage;
