import { api } from "@/trpc/server";
import { type RouterOutputs } from "@/trpc/shared";
import { Suspense, type FC } from "react";
import EducationalResourcesActions from "./actions";
import EducationalResourceUI from "./item";

const EducationalResourcesList: FC = () => {
  return (
    <Suspense fallback={"loading..."}>
      <div className="flex flex-col gap-6">
        <EducationalResourcesListContent />
      </div>
    </Suspense>
  );
};

const EducationalResourcesListContent: FC = async () => {
  const educationalResources = await api.educationalResources.list();
  const educationalResourcesByGroup = educationalResources.reduce((acc, v) => {
    const key = v.groups?.id;
    const forGroup = acc.get(key);
    if (!forGroup)
      acc.set(key, {
        group: v.groups,
        educationalResources: [v.educational_resources],
      });
    else forGroup.educationalResources.push(v.educational_resources);
    return acc;
  }, new Map<string | undefined, { group: RouterOutputs["groups"]["read"] | null; educationalResources: RouterOutputs["educationalResources"]["read"][] }>());

  return (
    <>
      {[...educationalResourcesByGroup].map(
        ([key, { group, educationalResources }]) => (
          <div key={key}>
            <h3 className="text-lg">{group?.title ?? "Общие"}</h3>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {educationalResources.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <EducationalResourceUI educationalResourceUI={item} />
                  <EducationalResourcesActions
                    educationalResourcesActions={item}
                  />
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </>
  );
};

export default EducationalResourcesList;
