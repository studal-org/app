import {
  Container,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import config from "tailwind.config";
import {
  Body,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardFooterColumn,
  CardFooterRow,
  CardHeader,
  CardTitle,
  Head,
} from "./components";

type MagicLinkEmailProps = {
  name: string;
  magicLink: string;
};

const MagicLinkEmail = ({ name, magicLink }: MagicLinkEmailProps) => {
  return (
    <Html lang="ru" dir="ltr">
      <Head></Head>
      <Preview>{magicLinkEmailSubject}</Preview>
      <Tailwind config={config}>
        <Body className="flex items-center justify-center">
          <Container className="max-w-md bg-card p-5">
            <Card>
              <CardHeader>
                <CardTitle>{magicLinkEmailSubject}</CardTitle>
                <CardDescription>Остался всего один шаг</CardDescription>
              </CardHeader>
              <CardContent>
                <Text className="mt-0">Добро пожаловать, {name}!</Text>
                <Text className="mb-0">
                  Нажмите на кнопку ниже, чтобы войти в Studal.
                </Text>
              </CardContent>
              <CardFooter>
                <CardFooterRow>
                  <CardFooterColumn>
                    <Button href={magicLink}>Войти</Button>
                  </CardFooterColumn>
                </CardFooterRow>
              </CardFooter>
            </Card>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const magicLinkEmailSubject = "Войдите в Studal";

export default MagicLinkEmail;
