import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { ChevronLeft, Database } from 'lucide-react';
import ManageClient from './ManageClient'; // Gọi component con

export default async function ManageFlashcardsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const vocabs = await prisma.vocabulary.findMany({
    where: { user: { email: session.user?.email! } },
    orderBy: { createdAt: 'desc' }
  });

  const decks = await prisma.deck.findMany({
    where: { user: { email: session.user?.email! } },
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <Link href="/flashcards" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> Quay lại Decks
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900">
            <Database className="w-8 h-8" /> Quản lý Kho Từ
          </h1>
        </div>
      </header>

      {/* Truyền data sang Client Component để xử lý logic Checkbox */}
      <ManageClient vocabs={vocabs} decks={decks} />
    </div>
  );
}