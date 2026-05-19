'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, Moon, Sun, PlusCircle, 
  Library, BrainCircuit, BookText, ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <aside className="w-64 h-screen bg-notion-sidebar border-r border-notion-border flex flex-col group transition-all duration-300">
      <div className="p-4 flex items-center justify-between hover:bg-notion-hover cursor-pointer transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5 h-5 bg-blue-500 rounded text-[10px] flex items-center justify-center text-white font-bold">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium truncate text-notion-text">{session?.user?.name || 'Guest'}</span>
        </div>
        <ChevronLeft className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <Link href="/dictionary" className={cn("flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors", pathname === '/dictionary' && "bg-notion-hover font-medium")}>
          <div className="flex items-center gap-2"><Search className="w-4 h-4" /><span>Search</span></div>
          <span className="text-[10px] text-zinc-400">⌘K</span>
        </Link>
        
        {/* NÚT SETTINGS BÂY GIỜ LÀ ĐỔI GIAO DIỆN (DARK/LIGHT) */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>
        )}

        <div className="mt-8 mb-2 px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Workspace</div>

        {[
          { name: 'The Vault', icon: Library, href: '/vault', emoji: '📚' },
          { name: 'Flashcards', icon: BrainCircuit, href: '/flashcards', emoji: '🧠' }
        ].map((item) => (
          <Link key={item.name} href={item.href} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-notion-text hover:bg-notion-hover transition-colors", pathname === item.href && "bg-notion-hover font-medium")}>
            <span className="w-4 text-center">{item.emoji}</span><span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-notion-border">
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-red-500 hover:bg-notion-hover transition-colors">
          <PlusCircle className="w-4 h-4 rotate-45" /><span>Log out</span>
        </button>
      </div>
    </aside>
  );
}