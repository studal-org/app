import type { FC, ReactNode } from "react";

import setDefaultOptions from "./default-options";

const DateFnsOptionsServerProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  setDefaultOptions();
  return children;
};

export default DateFnsOptionsServerProvider;
