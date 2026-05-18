import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FlashcardItem } from '@/components/FlashcardItem';
import Link from 'next/link';

export default async function FlashcardsPage() {
  // BẮT BUỘC PHẢI CÓ ĐOẠN NÀY ĐỂ LẤY DỮ LIỆU TỪ DATABASE
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="p-20 text-center font-bold">Đăng nhập đi em trai!</div>;
  }

  // Lấy danh sách vocabs của user đang đăng nhập
  const vocabs = await prisma.vocabulary.findMany({
    where: { user: { email: session.user?.email! } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900">
            <span className="text-4xl">🧠</span> Flashcards
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            Mày đang có <span className="text-zinc-900 font-bold">{vocabs.length}</span> từ vựng cần ghi nhớ.
          </p>
        </div>
        
        <Link href="/vault" className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
          + Thêm từ mới
        </Link>
      </header>

      {/* Lưới Flashcards */}
      {vocabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocabs.map((v, index) => (
            <FlashcardItem 
              key={v.id} 
              id={v.id} 
              word={v.word} 
              meaning={v.meaning} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-notion-border rounded-xl bg-zinc-50/50">
          <span className="text-4xl mb-4">📭</span>
          <p className="text-zinc-500 font-medium">Kho từ vựng đang trống rỗng.</p>
          <p className="text-zinc-400 text-xs mt-1">Hãy vào "The Vault" hoặc "Dictionary" để lưu từ nhé.</p>
        </div>
      )}
    </div>
  );
}