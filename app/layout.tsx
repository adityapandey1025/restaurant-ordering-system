import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Providers } from "@/components/session-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = { title: "Table & Tiffin", description: "A virtual restaurant ordering sandbox" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            <Header />
            <div className="fade-in">{children}</div>
            <footer className="border-t border-ink/10 px-4 py-8 text-center text-xs text-ink/50">
              Table &amp; Tiffin demo. Test wallet only. No real money, cards, or UPI.
            </footer>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
