import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Button as ReactEmailButton } from "@react-email/components";
import { type VariantProps } from "class-variance-authority";
import type { ComponentProps, FC } from "react";

export const Button: FC<
  ComponentProps<typeof ReactEmailButton> & VariantProps<typeof buttonVariants>
> = ({ className, variant, size, ...props }) => (
  <ReactEmailButton
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
);
