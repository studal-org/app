import { type FC } from "react";

import { VkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const OauthVk: FC = () => (
  <Button variant="outline">
    <VkIcon className="mr-2 h-4 w-4" /> VK ID
  </Button>
);

export default OauthVk;
