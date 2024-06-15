import { cn } from "@/lib/utils";
import {
  Column,
  Container,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { ComponentProps, FC } from "react";

export const Card: FC<ComponentProps<typeof Container>> = ({
  className,
  ...props
}) => (
  <Container
    className={cn(
      "rounded-lg border border-solid border-border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
);

export const CardHeader: FC<ComponentProps<typeof Section>> = ({
  className,
  children,
  ...props
}) => (
  <Section className={cn("p-6", className)} {...props}>
    <Row>
      <Column className="flex flex-col gap-y-1.5">{children}</Column>
    </Row>
  </Section>
);

export const CardTitle: FC<ComponentProps<typeof Heading>> = ({
  className,
  ...props
}) => (
  <Heading
    className={cn(
      "m-0 text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);

export const CardDescription: FC<ComponentProps<typeof Text>> = ({
  className,
  ...props
}) => (
  <Text
    className={cn("m-0 text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const CardContent: FC<ComponentProps<typeof Container>> = ({
  className,
  ...props
}) => <Container className={cn("p-6 pt-0", className)} {...props} />;

export const CardFooter: FC<ComponentProps<typeof Container>> = ({
  className,
  ...props
}) => <Section className={cn("p-6 pt-0", className)} {...props} />;

export const CardFooterRow: FC<ComponentProps<typeof Row>> = (props) => (
  <Row {...props} />
);

export const CardFooterColumn: FC<ComponentProps<typeof Column>> = ({
  className,
  ...props
}) => <Column className={cn("flex items-center", className)} {...props} />;
