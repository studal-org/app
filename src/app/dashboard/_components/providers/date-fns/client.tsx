"use client";

import type { FC, ReactNode } from "react";

import setDefaultOptions from "./default-options";

const DateFnsOptionsClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  setDefaultOptions();
  return children;
};

export default DateFnsOptionsClientProvider;
