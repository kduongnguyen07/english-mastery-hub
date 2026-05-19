'use client';

import { createLesson } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Info } from 'lucide-react';

export default function AddLessonPage() {
  const [lessonType, setLessonType] = useState('');

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Navigation */}
      <div className="flex items-center justify-between text-sm text-zinc-500 mb-8">
        <Link href="/vault" className="flex items-center gap-1 hover:text-zinc-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Quay lại kho
        </Link>
      </div>

      <div className="space-y-2 border-b border-notion-border pb-6">
        <h1 className="text-4xl font-bold flex items-center gap-3 text-zinc-900">
          <span className="text-4xl">📄</span> Thêm bài học mới
        </h1>
        <p className="text-zinc-500 font-medium text-sm">
          Tạo tài liệu mới cho The Vault.
        </p>
      </div>

      <form action={createLesson} className="space-y-6">
        <input type="hidden" name="type" value={lessonType} />

        {/* Tiêu đề */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tiêu đề bài học</label>
          <Input 
            name="title" 
            placeholder="VD: 50 Idioms thông dụng..." 
            className="h-12 border-notion-border focus-visible:ring-1 focus-visible:ring-zinc-300 rounded-md text-lg font-medium" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loại bài học */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loại</label>
            <Select onValueChange={setLessonType} required>
              <SelectTrigger className="h-12 w-full border-notion-border bg-transparent rounded-md focus:ring-1 focus:ring-zinc-300 flex items-center justify-between px-3">
                {/* Đảm bảo SelectValue nằm trong một container sạch sẽ */}
                <div className="truncate flex-1 text-left">
                  <SelectValue placeholder="Chọn loại bài học..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IELTS">IELTS</SelectItem>
                <SelectItem value="HSG">Học sinh giỏi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phân mục */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Phân mục</label>
            <Input 
              name="category" 
              placeholder="VD: Idioms, Vocab..." 
              className="h-12 border-notion-border focus-visible:ring-1 focus-visible:ring-zinc-300 rounded-md" 
              required 
            />
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nội dung bài học</label>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded">
              <Info className="h-3 w-3" /> Định dạng: Từ vựng : Nghĩa
            </div>
          </div>
          <Textarea 
            name="content" 
            placeholder="favorable : thuận lợi&#10;advocate : biện hộ&#10;..." 
            rows={20} 
            className="border-notion-border focus-visible:ring-1 focus-visible:ring-zinc-300 rounded-md p-4 font-mono text-sm leading-relaxed bg-[#fbfbfa] resize-y" 
            required 
          />
        </div>

        {/* Nút lưu */}
        <div className="pt-6 border-t border-notion-border">
          <button type="submit" className="flex items-center justify-center gap-2 w-full h-12 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Đăng bài học
          </button>
        </div>
      </form>
    </div>
  );
}