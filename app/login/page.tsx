'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (res?.error) {
      toast.error("Sai email hoặc mật khẩu!");
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-notion-bg animate-in fade-in duration-500">
      <div className="w-full max-w-sm px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-3xl font-bold text-notion-text tracking-tighter">Log in</h1>
          <p className="text-sm text-zinc-500">Chào mừng mày quay lại hệ thống.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
            <input name="email" type="email" placeholder="admin@gmail.com" required 
              className="w-full h-11 px-3 bg-notion-sidebar border border-notion-border rounded-lg text-sm focus:outline-none focus:border-zinc-500 text-notion-text" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" required 
              className="w-full h-11 px-3 bg-notion-sidebar border border-notion-border rounded-lg text-sm focus:outline-none focus:border-zinc-500 text-notion-text" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm">
            {isLoading ? 'Authenticating...' : 'Continue'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-notion-border">
          <p className="text-sm text-zinc-500">Chưa có tài khoản? <Link href="/register" className="font-bold text-notion-text hover:underline">Đăng ký</Link></p>
        </div>
      </div>
    </div>
  );
}