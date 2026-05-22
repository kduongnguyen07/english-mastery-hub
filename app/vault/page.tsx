import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DeleteLessonButton } from '@/components/DeleteLessonButton';

export default async function VaultPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900 text-notion-text">
            <span className="text-4xl">📚</span> The Vault
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            Kho tài liệu IELTS & HSG. Admin có quyền thêm và xoá bài.
          </p>
        </div>
        
        {isAdmin && (
          <Link 
            href="/admin/add-lesson" 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm bài mới
          </Link>
        )}
      </header>

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-notion-border rounded-xl">
          <span className="text-4xl mb-4">📭</span>
          <p className="text-zinc-500 font-medium">Chưa có bài học nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="relative group">
              <Link href={`/lessons/${lesson.id}`} className="block h-full border border-notion-border rounded-xl p-5 hover:bg-notion-hover transition-all bg-white dark:bg-notion-sidebar shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                    {lesson.type}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-notion-text group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                  {lesson.title}
                </h3>
                
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {lesson.category}
                  </p>
                  
                  {/* NÚT XOÁ CHỈ DÀNH CHO ADMIN */}
                  {isAdmin && (
                    <DeleteLessonButton id={lesson.id} title={lesson.title} />
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}