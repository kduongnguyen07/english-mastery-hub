import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

/**
 * Trang danh sách tất cả bài học (The Vault).
 * @returns {JSX.Element}
 */
export default async function VaultPage() {
  // 1. Lấy toàn bộ bài học từ Database, bài mới nhất hiện lên đầu
  const lessons = await prisma.lesson.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900">The Vault</h1>
            <p className="text-zinc-500">Kho lưu trữ bài học HSG & IELTS</p>
          </div>
          <Link href="/admin/add-lesson">
            <Button variant="outline">+ Thêm bài mới</Button>
          </Link>
        </div>

        {/* Lưới danh sách bài học */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.length === 0 ? (
            <p className="text-zinc-500 italic">Chưa có bài học nào được đăng.</p>
          ) : (
            lessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                      {lesson.type}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-xl">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-500 mb-4 italic">
                    Phân mục: {lesson.category}
                  </p>
                  <Link href={`/lessons/${lesson.id}`}>
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" /> Bắt đầu học
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}