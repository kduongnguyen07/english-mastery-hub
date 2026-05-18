'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      toast.error("Sai email hoặc mật khẩu rồi!");
      setIsLoading(false);
    } else {
      toast.success("Chào mừng mày quay trở lại!");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-4">
      <Card className="w-full max-w-md border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[40px] p-4 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
            <LockKeyhole className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black text-zinc-900 tracking-tight">Đăng nhập</CardTitle>
          <CardDescription className="font-medium">Tiếp tục hành trình học tập của mày.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Email</label>
              <Input name="email" type="email" placeholder="admin@gmail.com" required className="h-12 rounded-2xl border-zinc-100 focus:ring-zinc-900" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Mật khẩu</label>
              <Input name="password" type="password" placeholder="••••••••" required className="h-12 rounded-2xl border-zinc-100 focus:ring-zinc-900" />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95">
              {isLoading ? 'Đang kiểm tra...' : 'Vào hệ thống'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-blue-600 font-black hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}