"use client";

import group1Hooks from "./1";

const useGroups = () => {
  const groupsHooks = [group1Hooks];

  const groupsFeatures: {
    item: JSX.Element;
    components: JSX.Element[];
  }[][] = [];

  for (const group of groupsHooks) {
    const groupsFeaturesGroup: {
      item: JSX.Element;
      components: JSX.Element[];
    }[] = [];
    for (const useFeature of group) {
      // Hook order is static.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      groupsFeaturesGroup.push(useFeature());
    }
    groupsFeatures.push(groupsFeaturesGroup);
  }

  const components = groupsFeatures.flatMap((group) =>
    group.flatMap(({ components }) => components),
  );

  const groups = groupsFeatures.map((group) => group.map(({ item }) => item));

  return { groups, components };
};

export default useGroups;
