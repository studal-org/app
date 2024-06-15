"use client";

import { Button } from "@/components/ui/button";
import { type FC } from "react";

const Error: FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ reset }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 rounded-md border bg-secondary p-5">
      <div className="text-2xl font-medium">
        Произошла непредвиденная ошибка
      </div>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
};

export default Error;
