import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FocusStudy } from '@/components/FocusStudy';

export default async function FocusModePage({
  searchParams
}: {
  searchParams: Promise<{ deck?: string }>
}) {
  const { deck } = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Lấy list từ vựng theo cái deck mà user click vào
  const vocabs = await prisma.vocabulary.findMany({
    where: { 
      user: { email: session.user?.email! },
      deckId: deck === 'uncategorized' ? null : deck
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      <Link href="/flashcards" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors mb-4 uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Thoát Focus Mode
      </Link>
      
      {/* Gọi giao diện vừa viết ở Bước 4 */}
      <FocusStudy vocabs={vocabs} />
    </div>
  );
}