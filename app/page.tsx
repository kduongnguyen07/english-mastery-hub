import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  LogOut, 
  User as UserIcon, 
  BookText, 
  BrainCircuit, 
  Library, 
  PlusCircle, 
  Search,
  GraduationCap
} from 'lucide-react';

/**
 * Trang chủ English Mastery Hub - Dashboard tổng hợp.
 * Tuân thủ chuẩn Server Component của Next.js 15/16.
 */
export default async function HomePage() {
  // Lấy session kèm theo authOptions để check Role
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <main className="min-h-screen bg-[#FBFBFE] pb-20">
      {/* NAVBAR CỰC SANG */}
      <nav className="bg-white border-b border-zinc-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-black text-xl tracking-tighter text-zinc-900">LearnWithKhanh.</span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin/add-lesson">
                <Button variant="ghost" size="sm" className="text-blue-600 font-bold">
                  <PlusCircle className="size-4 mr-2" /> Thêm bài học
                </Button>
              </Link>
            )}
            
            {session ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-zinc-900">{session.user?.name}</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-black">{(session.user as any).role}</span>
                </div>
                <Link href="/api/auth/signout">
                  <Button variant="outline" size="icon" className="rounded-full border-zinc-200">
                    <LogOut className="size-4 text-red-500" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">Đăng nhập</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-6">
        <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-6 tracking-tight">
          Master English <br />
          <span className="text-blue-600">Every Single Day.</span>
        </h1>
        <p className="text-lg text-zinc-500 mb-10 max-w-2xl mx-auto font-medium">
          Hệ thống ôn luyện HSG & IELTS chuyên nghiệp dành riêng cho anh em mình. 
          Tra cứu chuẩn Cambridge, lưu từ vựng thông minh.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dictionary">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-lg font-bold shadow-xl">
              <Search className="mr-2 h-5 w-5" /> Tra từ điển ngay
            </Button>
          </Link>
          <Link href="/vault">
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-2 text-lg font-bold">
              Vào kho bài học
            </Button>
          </Link>
        </div>
      </div>

      {/* MODULES GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* THE VAULT */}
        <Link href="/vault">
          <Card className="group hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl rounded-[32px] border-none p-4 bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Library className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl font-black">The Vault</CardTitle>
              <CardDescription className="font-medium">
                Kho tài liệu HSG & IELTS được phân loại chi tiết.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* FLASHCARDS */}
        <Link href="/flashcards">
          <Card className="group hover:border-indigo-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl rounded-[32px] border-none p-4 bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                <BrainCircuit className="h-6 w-6 text-indigo-600 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl font-black">Flashcards</CardTitle>
              <CardDescription className="font-medium">
                Ôn tập từ vựng theo phương pháp lặp lại ngắt quãng.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* DICTIONARY QUICK ACCESS */}
        <Link href="/dictionary">
          <Card className="group hover:border-yellow-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl rounded-[32px] border-none p-4 bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
                <BookText className="h-6 w-6 text-yellow-600 group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl font-black">Dictionary</CardTitle>
              <CardDescription className="font-medium">
                Tra cứu chuẩn Cambridge Academic kèm phát âm UK/US.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
}