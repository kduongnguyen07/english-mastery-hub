import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Copy, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SaveVocabButton } from '@/components/SaveVocabButton'; // Import vào

export default async function LessonDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id } });

  if (!lesson) notFound();

  // MẸO SENIOR: Tự động tách nội dung thô thành danh sách để hiển thị đẹp hơn
  // Tách theo dòng, sau đó mỗi dòng tách theo dấu ":"
  const items = lesson.content.split('\n').filter(line => line.trim() !== '').map(line => {
    const [word, ...meaningParts] = line.split(':');
    return {
      word: word?.trim(),
      meaning: meaningParts.join(':')?.trim() // Phòng trường hợp nghĩa có chứa dấu :
    };
  });

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* Header xịn xò, dính trên đầu khi cuộn */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/vault" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" /> Quay lại
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon"><BookmarkPlus className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Copy className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Tiêu đề và thông tin chung */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full tracking-wider uppercase">
              {lesson.type}
            </span>
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
              {lesson.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tight">
            {lesson.title}
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Danh sách nội dung đã được xử lý thành Card */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="group hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md border-zinc-200/60">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Cột từ tiếng Anh */}
                  <div className="p-5 md:w-1/3 bg-zinc-50/50 group-hover:bg-blue-50/50 transition-colors border-b md:border-b-0 md:border-r border-zinc-100">
                    <span className="text-xs font-bold text-zinc-400 block mb-1"># {index + 1}</span>
                    <h3 className="text-lg font-bold text-blue-700 leading-tight">
                      {item.word}
                    </h3>
                  </div>
                  
                  {/* Cột nghĩa tiếng Việt */}
                  <div className="p-5 md:w-2/3 flex justify-between items-center">
                    <p className="text-zinc-700 font-medium leading-relaxed">
                      {item.meaning}
                    </p>
                      <SaveVocabButton word={item.word} meaning={item.meaning} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nút hoàn thành ở cuối trang */}
        <div className="mt-12 text-center">
          <Button size="lg" className="px-12 py-6 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
            <BookOpen className="mr-2 h-5 w-5" /> Đã học xong bài này
          </Button>
        </div>
      </div>
    </main>
  );
}