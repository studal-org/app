import { getSession } from "@/server/auth/session";
import { Calendar, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { type FC } from "react";
import StudentEducationalResources from "./_components/educational-resources";
import Widget from "./_components/widget";

const StudentPage: FC = async () => {
  const session = await getSession();

  if (!session) redirect("/dashboard");

  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Добро пожаловать, {session.user.firstName}
      </h1>
      <div className="mt-4 flex flex-col gap-6">
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
        <StudentEducationalResources />
      </div>
    </div>
  );
};

export default StudentPage;
