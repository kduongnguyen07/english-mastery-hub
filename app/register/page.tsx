'use client';

import { registerUser } from '@/lib/actions';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await registerUser(formData);
      toast.success("Đăng ký thành công! Chuyển sang đăng nhập...");
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center space-y-2">
          <div className="text-5xl mb-6">🎓</div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Create an account</h1>
          <p className="text-sm text-zinc-500 font-medium">Bắt đầu xây dựng Workspace của mày.</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Họ và tên</label>
            <input 
              name="name" 
              placeholder="Nguyễn Văn A" 
              required 
              className="w-full h-11 px-3 bg-transparent border border-notion-border rounded-md text-sm focus:outline-none focus:border-zinc-400 transition-colors" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
            <input 
              name="email" 
              type="email" 
              placeholder="a.nguyen@gmail.com" 
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
            className="w-full h-11 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors text-sm flex items-center justify-center"
          >
            Create account
          </button>
        </form>

        <div className="text-center pt-4 border-t border-notion-border">
          <p className="text-sm text-zinc-500">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-zinc-900 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}