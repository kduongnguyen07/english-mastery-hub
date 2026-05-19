import { generateQuizData } from '@/lib/actions';
import { TimeAttack } from '@/components/TimeAttack';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function TimeAttackPage({
  searchParams
}: {
  searchParams: Promise<{ deck?: string }>
}) {
  const { deck } = await searchParams;
  let questions = [];
  let errorMsg = null;

  try {
    questions = await generateQuizData(deck);
  } catch (e: any) {
    errorMsg = e.message;
  }

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      <Link href="/flashcards" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors mb-4 uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Thoát Time Attack
      </Link>
      
      {errorMsg ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
          <span className="text-4xl mb-4">⚠️</span>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <TimeAttack questions={questions} />
      )}
    </div>
  );
}