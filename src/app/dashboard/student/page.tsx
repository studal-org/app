import { decomposeFullname } from "@/lib/utils";
import { getSession } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { type FC } from "react";

const StudentPage: FC = async () => {
  const session = await getSession();

  if (!session) redirect("/dashboard");

  const { fullName } = session.user;

  const greetingNamePart = fullName
    ? `, ${decomposeFullname(fullName).firstName}`
    : "";

  return (
    <div>
      <h1 className="w-fit items-center border-b pb-1 text-2xl font-semibold tracking-tight lg:text-3xl">
        Добро пожаловать{greetingNamePart}
      </h1>
    </div>
  );
};

export default StudentPage;
