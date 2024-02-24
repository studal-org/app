import { type FC } from "react";
import OauthVk from "./vk";

const OauthMethod: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <OauthVk />
    </div>
  );
};

export default OauthMethod;
