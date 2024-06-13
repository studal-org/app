import EducationalResourceUI from "@/app/dashboard/admin/_components/educational_resources/item";
import { api } from "@/trpc/server";
import { Suspense, type FC } from "react";

const EducationalResourcesList: FC = () => {
  return (
    <Suspense fallback={"loading..."}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2">
        <EducationalResourcesListContent />
      </div>
    </Suspense>
  );
};

const EducationalResourcesListContent: FC = async () => {
  const educationalResources = await api.educationalResources.list();
  return (
    <>
      {educationalResources.map((item) => (
        <EducationalResourceUI key={item.id} educationalResourceUI={item} />
      ))}
    </>
  );
};

export default EducationalResourcesList;
