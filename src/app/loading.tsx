import { Loader2 } from "lucide-react";
import { type FC } from "react";

const Loading: FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Loading;
