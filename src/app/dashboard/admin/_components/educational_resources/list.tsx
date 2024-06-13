import { api } from "@/trpc/server";
import { Suspense, type FC } from "react";
import EducationalResourcesDelete from "./actions/delete";
import { EducationalResourcesEdit } from "./actions/edit";
import EducationalResourceUI from "./item";

const EducationalResourcesList: FC = () => {
  return (
    <Suspense fallback={"loading..."}>
      <div className="grid grid-cols-4 gap-4">
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
        <div key={item.id} className="flex flex-col gap-1">
          <EducationalResourceUI educationalResourceUI={item} />
          <div className="grid grid-cols-2 gap-1">
            <EducationalResourcesEdit
              educationalResourcesEdit={{
                educationalResourcesUpsertForm: item,
              }}
            />
            <EducationalResourcesDelete
              educationalResourcesDelete={{ educationalResourceUI: item }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default EducationalResourcesList;
