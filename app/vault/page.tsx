import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, ChevronRight, LayoutGrid, Trash2, FolderOpen } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createExam, deleteExam, deleteLesson } from '@/lib/actions';

export default async function VaultPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const exams = await prisma.exam.findMany({
    include: { lessons: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });

  const soloLessons = await prisma.lesson.findMany({
    where: { examId: null },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-notion-border pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-notion-text">
            <span className="text-4xl">📚</span> The Vault
          </h1>
          <p className="text-zinc-500 font-medium text-sm">Tài liệu IELTS & HSG theo Đề thi.</p>
        </div>
        {isAdmin && (
          <Link href="/admin/add-lesson" className="px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold hover:bg-zinc-800 transition-all">+ Thêm bài lẻ</Link>
        )}
      </header>

      {isAdmin && (
        <form action={createExam} className="flex gap-3 p-4 bg-notion-sidebar border border-notion-border rounded-xl items-center">
          <FolderOpen className="w-5 h-5 text-zinc-400" />
          <input name="title" placeholder="Tên đề mới (VD: Cam 18)..." className="flex-1 bg-transparent text-sm outline-none" required />
          <select name="type" className="bg-transparent text-sm font-bold outline-none border-l border-notion-border pl-3">
            <option value="IELTS">IELTS</option>
            <option value="HSG">HSG</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700 transition-all">Tạo nhóm</button>
        </form>
      )}

      <div className="space-y-12">
        {exams.map(exam => (
          <section key={exam.id} className="space-y-4">
            <div className="flex items-center justify-between group border-b border-notion-border pb-2">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">{exam.title}</h2>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{exam.type}</span>
              </div>
              {isAdmin && (
                <form action={async () => { 'use server'; await deleteExam(exam.id); }}>
                  <button type="submit" className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                </form>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {exam.lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} isAdmin={isAdmin} />)}
              {isAdmin && (
                <Link href={`/admin/add-lesson?examId=${exam.id}`} className="flex flex-col items-center justify-center border-2 border-dashed border-notion-border rounded-xl p-6 hover:bg-notion-hover text-zinc-400 transition-all group">
                  <Plus className="w-6 h-6 mb-1 group-hover:scale-110" /><span className="text-[10px] font-bold uppercase">Thêm vào đề</span>
                </Link>
              )}
            </div>
          </section>
        ))}
        {soloLessons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-notion-border pb-2">
              <LayoutGrid className="w-4 h-4 text-zinc-400" /><h2 className="text-sm font-black uppercase text-zinc-500">Bài học lẻ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {soloLessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} isAdmin={isAdmin} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function LessonCard({ lesson, isAdmin }: { lesson: any, isAdmin: boolean }) {
  return (
    <Link href={`/lessons/${lesson.id}`} className="group relative block h-full border border-notion-border rounded-xl p-5 hover:border-zinc-300 hover:shadow-md transition-all bg-white dark:bg-notion-sidebar">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded">{lesson.category}</span>
        {isAdmin && (
          <form action={async () => { 'use server'; await deleteLesson(lesson.id); }}>
            <button type="submit" className="p-1 text-zinc-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </form>
        )}
      </div>
      <h3 className="font-bold text-notion-text group-hover:text-blue-600 transition-colors leading-snug">{lesson.title}</h3>
    </Link>
  );
}