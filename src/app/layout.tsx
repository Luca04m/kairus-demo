import type { Metadata } from "next";
import "./globals.css";
import { AppShellClient } from "@/components/AppShellClient";

export const metadata: Metadata = {
  title: "Kairus OS",
  description: "Plataforma de gestao inteligente",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
      </head>
      <body className="h-full bg-background text-foreground">
        <div
          className="h-screen bg-background"
          style={{
            backgroundImage:
              "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)",
          }}
        >
          <AppShellClient>{children}</AppShellClient>
        </div>
      </body>
    </html>
  );
}
