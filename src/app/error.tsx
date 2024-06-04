"use client";

import { Button } from "@/components/ui/button";
import { type FC } from "react";

const Error: FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ reset }) => {
  return (
    <div className="bg-secondary h-full flex-col flex items-center justify-center gap-4 p-5 rounded-md border">
      <div className="text-2xl font-medium">
        Произошла непредвиденная ошибка
      </div>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
};

export default Error;
