import { Sidebar } from "@/components/Sidebar";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-[#ffffff]">
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative">
            <div className="h-12 flex items-center px-8 text-sm text-zinc-400 border-b border-notion-border">
              <span>English Mastery Hub</span>
            </div>
            
            {/* ĐÂY, ĐÃ XÓA GIỚI HẠN CHIỀU RỘNG, ĐỂ NÓ FULL 100% (w-full) */}
            <div className="w-full px-8 md:px-12 py-10">
              {children}
            </div>
          </main>
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}