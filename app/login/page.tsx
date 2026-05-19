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
      toast.error("Sai email hoặc mật khẩu rồi!");
      setIsLoading(false);
    } else {
      toast.success("Chào mừng quay trở lại Workspace.");
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center space-y-2">
          <div className="text-5xl mb-6">🔐</div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Log in</h1>
          <p className="text-sm text-zinc-500 font-medium">Tiếp tục hành trình học tập của mày.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="admin@gmail.com" 
              required 
              className="w-full h-11 px-3 bg-transparent border border-notion-border rounded-md text-sm focus:outline-none focus:border-zinc-400 transition-colors" 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="w-full h-11 px-3 bg-transparent border border-notion-border rounded-md text-sm focus:outline-none focus:border-zinc-400 transition-colors" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-11 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors text-sm flex items-center justify-center"
          >
            {isLoading ? 'Đang xác thực...' : 'Continue'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-notion-border">
          <p className="text-sm text-zinc-500">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-bold text-zinc-900 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}