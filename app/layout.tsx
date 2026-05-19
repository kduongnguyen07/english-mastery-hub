'use client';

import { Sidebar } from "@/components/Sidebar";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Kiểm tra xem có phải trang Auth không
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden bg-notion-bg text-notion-text">
        <Providers>
          {!isAuthPage && <Sidebar />}
          <main className={`flex-1 overflow-y-auto relative flex flex-col ${isAuthPage ? 'h-full' : ''}`}>
            {!isAuthPage && (
              <div className="h-12 shrink-0 flex items-center px-8 text-sm text-zinc-500 border-b border-notion-border">
                <span>English Mastery Hub</span>
              </div>
            )}
            
            {/* Nếu là trang Login thì không có padding để nó căn giữa chuẩn */}
            <div className={`${isAuthPage ? 'h-full w-full' : 'w-full px-8 md:px-16 py-10'}`}>
              {children}
            </div>
          </main>
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}