import { Font, Head as ReactEmailHead } from "@react-email/components";
import type { ComponentProps, FC } from "react";

export const Head: FC<ComponentProps<typeof ReactEmailHead>> = (props) => {
  const interUrls = [
    "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7SUc.woff2", // cyrillic
    "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2", // latin
  ];
  return (
    <ReactEmailHead {...props}>
      {interUrls.map((url) => (
        <Font
          key={url}
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          fontStyle="normal"
          fontWeight="100 900"
          webFont={{
            url: url,
            format: "woff2",
          }}
        />
      ))}
      <style>
        {`
        * {
          box-sizing: border-box;
        }
        `}
      </style>
    </ReactEmailHead>
  );
};
