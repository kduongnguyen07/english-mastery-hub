import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, Plus } from 'lucide-react';

export default async function VaultPage() {
  // Lấy toàn bộ bài học từ Database, bài mới nhất hiện lên đầu
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header chuẩn Notion */}
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900">
            <span className="text-4xl">📚</span> The Vault
          </h1>
          <p className="text-zinc-500 font-medium text-sm">
            Kho lưu trữ bài học HSG & IELTS. Chinh phục từng bài một nhé.
          </p>
        </div>
        
        {/* Nút thêm bài mới */}
        <Link 
          href="/admin/add-lesson" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-notion-border hover:bg-notion-hover text-zinc-700 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm bài mới
        </Link>
      </header>

      {/* Lưới danh sách bài học (Notion Gallery View) */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-notion-border rounded-xl bg-zinc-50/50">
          <span className="text-4xl mb-4">📭</span>
          <p className="text-zinc-500 font-medium">Chưa có bài học nào được đăng.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="block group">
              <div className="h-full border border-notion-border rounded-xl p-5 hover:bg-notion-hover transition-colors bg-white shadow-sm flex flex-col cursor-pointer">
                
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">
                    {lesson.type}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                  {lesson.title}
                </h3>
                
                <p className="text-sm text-zinc-500 mt-auto flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-400" /> {lesson.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}