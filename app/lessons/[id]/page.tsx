import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Settings2, CheckCircle2 } from 'lucide-react';
import { SaveVocabButton } from '@/components/SaveVocabButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) notFound();

  const items = lesson.content.split('\n').filter(line => line.trim() !== '').map(line => {
    const [word, ...meaningParts] = line.split(':');
    return {
      word: word?.trim() || "N/A",
      meaning: meaningParts.join(':')?.trim() || "Chưa có nghĩa"
    };
  });

  return (
    // Đã xóa max-w-5xl, đổi thành w-full
    <div className="w-full space-y-10 animate-in fade-in duration-500 pb-20">
      
      <div className="flex items-center justify-between text-sm text-zinc-500 mb-8">
        <Link href="/vault" className="flex items-center gap-1 hover:text-zinc-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Quay lại kho
        </Link>
        
        {isAdmin && (
          <Link href={`/admin/edit-lesson/${id}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Settings2 className="w-4 h-4" /> Edit page
          </Link>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-5xl">📖</span>
          <span className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded uppercase tracking-wider">
            {lesson.type} • {lesson.category}
          </span>
        </div>
        <h1 className="text-5xl font-bold text-zinc-900 leading-tight">
          {lesson.title}
        </h1>
        <p className="text-zinc-400 flex items-center gap-2 border-b border-notion-border pb-6">
          <BookOpen className="w-4 h-4" /> {items.length} từ vựng
        </p>
      </div>

      {/* ĐÂY: Thêm xl:grid-cols-4 và 2xl:grid-cols-5 để nó tự nở rộng ra */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col justify-between p-5 rounded-xl border border-notion-border bg-white hover:border-zinc-300 hover:shadow-sm transition-all h-full"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Term #{index + 1}
                </span>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2">
                  <SaveVocabButton word={item.word} meaning={item.meaning} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-4">
                {item.word}
              </h3>
            </div>
            
            <div className="border-t border-notion-border pt-3 mt-auto">
              <p className="text-sm text-zinc-600 leading-relaxed">
                {item.meaning}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 border-t border-notion-border">
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors">
          <CheckCircle2 className="w-4 h-4" /> Đánh dấu đã học
        </button>
      </div>
    </div>
  );
}