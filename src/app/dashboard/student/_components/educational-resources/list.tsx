import EducationalResourceUI, {
  EducationalResourceUILoading,
} from "@/app/dashboard/admin/_components/educational_resources/item";
import { api } from "@/trpc/server";
import { Suspense, type FC } from "react";

const EducationalResourcesList: FC = () => {
  return (
    <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<EducationalResourcesListContentLoading />}>
        <EducationalResourcesListContent />
      </Suspense>
    </div>
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

const EducationalResourcesListContentLoading: FC = () => (
  <>
    {[...Array(4).keys()].map((key) => (
      <EducationalResourceUILoading key={key} widgetLoading={{}} />
    ))}
  </>
);

export default EducationalResourcesList;
