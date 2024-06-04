import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

import Providers from "./dashboard/_components/providers";

const fontSans = FontSans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Студал",
  description:
    "Студенческий портал нижневартовского социально-гуманитарного колледжа",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background text-foreground min-h-screen h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
