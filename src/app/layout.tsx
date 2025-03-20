import "../styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
  title: "Linktree",
  description: "User links page",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
