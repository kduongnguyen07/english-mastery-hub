'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Clock, 
  Settings, 
  PlusCircle, 
  Library, 
  BrainCircuit, 
  BookText,
  ChevronLeft,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

/**
 * Sidebar component following Notion's minimalist design.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
    <aside className="w-64 h-screen bg-notion-sidebar border-r border-notion-border flex flex-col group transition-all duration-300">
      {/* User Profile */}
      <div className="p-4 flex items-center justify-between hover:bg-notion-hover cursor-pointer transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5 h-5 bg-blue-500 rounded text-[10px] flex items-center justify-center text-white font-bold">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium truncate">{session?.user?.name || 'Guest'}</span>
        </div>
        <ChevronLeft className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
      </div>

      {/* Top Menu */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={cn(
              "flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-zinc-600 hover:bg-notion-hover transition-colors",
              pathname === item.href && "bg-notion-hover text-zinc-900 font-medium"
            )}
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.shortcut && <span className="text-[10px] text-zinc-400">{item.shortcut}</span>}
          </Link>
        ))}

        <div className="mt-8 mb-2 px-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Workspace
        </div>

        {workspaceItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-zinc-600 hover:bg-notion-hover transition-colors",
              pathname === item.href && "bg-notion-hover text-zinc-900 font-medium"
            )}
          >
            <span className="w-4 text-center">{item.emoji}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 border-t border-notion-border">
        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <PlusCircle className="w-4 h-4 rotate-45" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}