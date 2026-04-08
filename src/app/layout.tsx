import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});
import { AppShellClient } from "@/components/AppShellClient";
import { Providers } from "@/providers/Providers";

export const metadata: Metadata = {
  title: { default: "Kairus OS", template: "%s | Kairus OS" },
  description: "Painel inteligente para PMEs — gestao, financeiro, marketing e vendas em um lugar",
  manifest: "/manifest.json",
  themeColor: "#080808",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kairus OS",
  },
  openGraph: {
    title: "Kairus OS",
    description: "Painel inteligente para PMEs",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kairus OS",
    description: "Painel inteligente para PMEs",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased dark ${geistSans.variable}`}>
      <head />
      <body className="h-full bg-background text-foreground">
        <Providers>
          <div
            className="h-screen bg-background"
            style={{
              backgroundImage:
                "radial-gradient(45% 250px at 50% 0px, rgba(255, 255, 255, 0.04) 18.31%, rgba(0, 0, 0, 0) 92.85%)",
            }}
          >
            <AppShellClient>{children}</AppShellClient>
          </div>
        </Providers>
      </body>
    </html>
  );
}
