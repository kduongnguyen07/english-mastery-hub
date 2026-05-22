'use client';

import { Sidebar } from "@/components/Sidebar";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from 'next/navigation';
import { Inter, Lora } from "next/font/google";
import { useState } from "react";
import { Menu } from "lucide-react";

// Tải Font chuẩn Notion (Inter cho chữ thường, Lora cho Tiêu đề)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  // State quản lý đóng/mở Menu trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body className="flex h-screen overflow-hidden bg-notion-bg text-notion-text font-sans">
        <Providers>
          
          {/* Truyền state vào Sidebar để nó biết lúc nào trượt ra/vào */}
          {!isAuthPage && (
            <Sidebar 
              isOpen={isMobileMenuOpen} 
              onClose={() => setIsMobileMenuOpen(false)} 
            />
          )}

          <main className={`flex-1 overflow-y-auto relative flex flex-col ${isAuthPage ? 'h-full' : ''}`}>
            {!isAuthPage && (
              <div className="h-12 shrink-0 flex items-center px-4 md:px-8 text-sm text-zinc-500 border-b border-notion-border gap-3 sticky top-0 bg-notion-bg z-30">
                {/* NÚT MENU: Chỉ hiện trên điện thoại (md:hidden) */}
                <button 
                  className="md:hidden p-1.5 hover:bg-notion-hover rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5 text-notion-text" />
                </button>
                <span className="font-medium">English Mastery Hub</span>
              </div>
            )}
            
            {/* Padding nhỏ lại trên điện thoại (px-4) để đỡ tốn diện tích */}
            <div className={`${isAuthPage ? 'h-full w-full' : 'w-full px-4 md:px-12 py-6 md:py-10'}`}>
              {children}
            </div>
          </main>
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}