'use client';

import { registerUser } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await registerUser(formData);
      toast.success("Đăng ký thành công! Đăng nhập ngay nhé.");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-4">
      <Card className="w-full max-w-md border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[40px] p-4 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-200">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black text-zinc-900 tracking-tight">Tạo tài khoản</CardTitle>
          <CardDescription className="font-medium">Bắt đầu hành trình chinh phục IELTS cùng EMH.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Họ và tên</label>
              <Input name="name" placeholder="VD: Nguyễn Văn Em" required className="h-12 rounded-2xl border-zinc-100 focus:ring-blue-600" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Email</label>
              <Input name="email" type="email" placeholder="emtrai@gmail.com" required className="h-12 rounded-2xl border-zinc-100 focus:ring-blue-600" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Mật khẩu</label>
              <Input name="password" type="password" placeholder="••••••••" required className="h-12 rounded-2xl border-zinc-100 focus:ring-blue-600" />
            </div>
            
            <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 transition-all active:scale-95">
              Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              Đã có tài khoản rồi?{' '}
              <Link href="/login" className="text-blue-600 font-black hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}