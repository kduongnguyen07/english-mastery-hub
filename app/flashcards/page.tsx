import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { createDeck } from '@/lib/actions';
import { Folder, Play, Plus, BrainCircuit, Timer } from 'lucide-react';

export default async function FlashcardsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Đăng nhập đi em trai</div>;

  // Lấy các Deck của user
  const decks = await prisma.deck.findMany({
    where: { user: { email: session.user?.email! } },
    include: { _count: { select: { vocabularies: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // Lấy từ vựng mồ côi (chưa nhét vào Deck nào)
  const uncategorizedCount = await prisma.vocabulary.count({
    where: { user: { email: session.user?.email! }, deckId: null }
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900">
            <span className="text-4xl">🗂️</span> Decks
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            Tạo nhóm từ vựng và bắt đầu Focus Mode, Quiz Mode hoặc Time Attack.
          </p>
        </div>

        <Link href="/flashcards/manage" className="px-4 py-2 bg-white border border-notion-border hover:bg-notion-hover text-zinc-700 rounded-md text-sm font-medium transition-colors shadow-sm">
          ⚙️ Quản lý Kho từ
        </Link>
      </header>

      {/* Form tạo Deck nhanh */}
      <form action={createDeck} className="flex gap-2">
        <input 
          name="name" 
          placeholder="Tên nhóm mới (VD: IELTS Reading 1)..." 
          className="flex-1 max-w-sm h-10 px-3 border border-notion-border rounded-md text-sm focus:outline-none focus:border-zinc-400"
          required 
        />
        <button type="submit" className="h-10 px-4 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tạo Deck
        </button>
      </form>

      {/* Grid hiện Decks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        
        {/* Thư mục mặc định */}
        <div className="group border border-notion-border bg-white rounded-xl p-5 hover:shadow-sm hover:border-zinc-300 transition-all flex flex-col min-h-[10rem]">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Folder className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-zinc-900">Chưa phân loại</h3>
              <p className="text-xs text-zinc-500 mt-1">{uncategorizedCount} từ vựng</p>
            </div>
          </div>
          <div className="mt-auto flex gap-2">
            <Link href="/flashcards/focus?deck=uncategorized" className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-blue-600 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
              <Play className="w-4 h-4 fill-current" /> Focus
            </Link>
            <Link href="/flashcards/quiz?deck=uncategorized" className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-green-600 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
              <BrainCircuit className="w-4 h-4" /> Quiz
            </Link>
            <Link href="/flashcards/time-attack?deck=uncategorized" className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-orange-500 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
              <Timer className="w-4 h-4" /> Rush
            </Link>
          </div>
        </div>

        {/* Thư mục tự tạo */}
        {decks.map(deck => (
          <div key={deck.id} className="group border border-notion-border bg-white rounded-xl p-5 hover:shadow-sm hover:border-zinc-300 transition-all flex flex-col min-h-[10rem]">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-zinc-100 text-zinc-600 rounded-lg"><Folder className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-zinc-900 line-clamp-1">{deck.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{deck._count.vocabularies} từ vựng</p>
              </div>
            </div>
            <div className="mt-auto flex gap-2">
              <Link href={`/flashcards/focus?deck=${deck.id}`} className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-blue-600 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
                <Play className="w-4 h-4 fill-current" /> Focus
              </Link>
              <Link href={`/flashcards/quiz?deck=${deck.id}`} className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-green-600 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
                <BrainCircuit className="w-4 h-4" /> Quiz
              </Link>
              <Link href={`/flashcards/time-attack?deck=${deck.id}`} className="flex-1 flex items-center justify-center gap-1 h-9 bg-zinc-100 hover:bg-orange-500 hover:text-white text-zinc-700 text-xs font-bold rounded-md transition-colors">
                <Timer className="w-4 h-4" /> Rush
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}