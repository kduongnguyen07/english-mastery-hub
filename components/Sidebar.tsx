'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, Moon, Sun, PlusCircle, Library, BrainCircuit, 
  ChevronLeft, LogIn, LogOut, Clock, Settings, BookText 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname === '/login' || pathname === '/register') return null;

  const menuItems = [
    { name: 'Search', icon: Search, href: '/dictionary', shortcut: '⌘K' },
    { name: 'Updates', icon: Clock, href: '#', shortcut: '' },
    { name: 'Settings', icon: Settings, href: '#', shortcut: '' },
  ];

  const workspaceItems = [
    { name: 'The Vault', icon: Library, href: '/vault', emoji: '📚' },
    { name: 'Flashcards', icon: BrainCircuit, href: '/flashcards', emoji: '🧠' },
    { name: 'Dictionary', icon: BookText, href: '/dictionary', emoji: '📖' },
  ];

  return (
    <>
      {/* LỚP NỀN ĐEN MỜ: Hiện ra khi mở menu trên điện thoại */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR: Trượt từ trái sang trên Mobile, Cố định trên Desktop */}
      <aside className={cn(
        "fixed md:static top-0 left-0 z-50 w-64 h-screen bg-notion-sidebar border-r border-notion-border flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 flex items-center justify-between hover:bg-notion-hover cursor-pointer transition-colors">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-5 h-5 bg-blue-500 rounded text-[10px] flex items-center justify-center text-white font-bold shrink-0">
              {session?.user?.name?.charAt(0) || 'G'}
            </div>
            <span className="text-sm font-medium truncate text-notion-text">{session?.user?.name || 'Guest'}</span>
          </div>
          {/* Nút đóng Menu trên điện thoại */}
          <button onClick={onClose} className="md:hidden p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded">
            <ChevronLeft className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link 
              onClick={onClose} 
              key={item.name} 
              href={item.href} 
              className={cn(
                "flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors", 
                pathname === item.href && "bg-notion-hover font-medium"
              )}
            >
              <div className="flex items-center gap-2"><item.icon className="w-4 h-4" /><span>{item.name}</span></div>
              {item.shortcut && <span className="text-[10px] text-zinc-400">{item.shortcut}</span>}
            </Link>
          ))}
          
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors text-left mt-1">
              <div className="flex items-center gap-2">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span></div>
            </button>
          )}

          <div className="mt-8 mb-2 px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Workspace</div>
          
          {workspaceItems.map((item) => (
            <Link 
              onClick={onClose} 
              key={item.name} 
              href={item.href} 
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors", 
                pathname === item.href && "bg-notion-hover font-medium text-zinc-900 dark:text-white"
              )}
            >
              <span className="w-4 text-center">{item.emoji}</span><span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-notion-border mt-auto">
          {session ? (
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-red-500 hover:bg-notion-hover transition-colors font-medium"><LogOut className="w-4 h-4" /><span>Log out</span></button>
          ) : (
            <Link onClick={onClose} href="/login" className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-blue-600 hover:bg-notion-hover transition-colors font-medium"><LogIn className="w-4 h-4" /><span>Log in</span></Link>
          )}
        </div>
      </aside>
    </>
  );
}