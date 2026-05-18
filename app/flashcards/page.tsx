import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FlashcardItem } from '@/components/FlashcardItem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Library, BrainCircuit } from 'lucide-react';

export default async function FlashcardsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="p-20 text-center font-bold">Đăng nhập đi em trai!</div>;

  const vocabs = await prisma.vocabulary.findMany({
    where: { user: { email: session.user?.email! } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-[#FBFBFE] pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
              <ChevronLeft className="mr-2 h-4 w-4" /> Trang chủ
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Study Mode</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Library className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">My Flashcards</h1>
            </div>
            <p className="text-zinc-500 font-medium">
              Mày đang có <span className="text-blue-600 font-bold">{vocabs.length}</span> từ vựng cần ghi nhớ.
            </p>
          </div>
          
          <Link href="/vault">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-6">
              Lấy thêm từ mới
            </Button>
          </Link>
        </div>
        
        {/* Grid Section */}
        {vocabs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vocabs.map((v, index) => (
              <FlashcardItem 
                key={v.id} 
                id={v.id}      // QUAN TRỌNG: Phải truyền ID vào đây
                word={v.word} 
                meaning={v.meaning} 
                index={index} 
            />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border-2 border-dashed border-zinc-100">
            <div className="bg-zinc-50 p-6 rounded-full mb-6">
              <Library className="h-12 w-12 text-zinc-200" />
            </div>
            <p className="text-zinc-400 font-bold text-xl">Kho từ vựng đang trống rỗng</p>
            <p className="text-zinc-400 text-sm mt-2">Vào "The Vault" và bấm nút (+) để thêm từ nhé.</p>
          </div>
        )}
      </div>
    </main>
  );
}