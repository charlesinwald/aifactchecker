import "../../globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "AI Fact Checker",
  description: "AI Fact Checker",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
