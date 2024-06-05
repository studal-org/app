import { decomposeFullname } from "@/lib/utils";
import { getSession } from "@/server/auth/session";
import { Calendar, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { type FC } from "react";
import Widget from "./_components/widget";

const StudentPage: FC = async () => {
  const session = await getSession();

  if (!session) redirect("/dashboard");

  const { fullName } = session.user;

  const greetingNamePart = fullName
    ? `, ${decomposeFullname(fullName).firstName}`
    : "";

  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Добро пожаловать{greetingNamePart}
      </h1>
      <div className="mt-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
          <Widget
            title="Расписание"
            content={{ text: "-", description: "уроков сегодня" }}
            Icon={Calendar}
            href="/dashboard/student/schedule"
          />
          <Widget
            title="Успеваемость"
            content={{ text: "-", description: "средний балл за неделю" }}
            Icon={TrendingUp}
            href="/dashboard/student/performance"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
