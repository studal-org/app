import type { FC, ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { Provider as JotaiProvider } from "jotai";
import DateFnsOptionsClientProvider from "./date-fns/client";
import DateFnsOptionsServerProvider from "./date-fns/server";

const Providers: FC<{ children: ReactNode }> = ({ children }) => (
  <JotaiProvider>
    <DateFnsOptionsServerProvider>
      <DateFnsOptionsClientProvider>
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </DateFnsOptionsClientProvider>
    </DateFnsOptionsServerProvider>
  </JotaiProvider>
);

export default Providers;
