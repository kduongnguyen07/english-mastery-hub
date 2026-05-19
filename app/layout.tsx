import { Sidebar } from "@/components/Sidebar";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden bg-notion-bg text-notion-text">
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative flex flex-col">
            {/* Top Bar mỏng */}
            <div className="h-12 shrink-0 flex items-center px-8 text-sm text-zinc-500 border-b border-notion-border">
              <span>English Mastery Hub</span>
            </div>
            
            {/* CHỖ NÀY: Xóa sạch max-w, để w-full và flex-1 để nó chiếm hết màn hình */}
            <div className="flex-1 w-full px-8 md:px-16 py-10">
              {children}
            </div>
          </main>
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}