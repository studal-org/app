import { type FC, type ReactNode } from "react";
import DashboardProfileSidebarItem from "./_components/sidebar-item";
import config from "./config";

const DashboardProfileLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      <h1 className="w-fit items-center border-b-2 text-2xl font-semibold tracking-tight lg:text-3xl">
        Профиль
      </h1>
      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_4fr]">
        <div className="flex flex-col gap-0.5">
          {config.map(({ id, title, Icon }) => (
            <DashboardProfileSidebarItem
              key={id}
              dashboardProfileSidebarItem={{
                id,
                title,
                icon: <Icon className="mr-2 h-4 w-4" />,
              }}
            />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardProfileLayout;
