'use client'; // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ MENU HOẠT ĐỘNG

import { createLesson } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useState } from 'react';

export default function AddLessonPage() {
  // Vì Select của Shadcn không tự nhảy vào FormData, ta dùng state để giữ giá trị
  const [lessonType, setLessonType] = useState('');

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Thêm bài học mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createLesson} className="space-y-6">
            {/* Input ẩn này để đảm bảo giá trị Select được gửi đi cùng form */}
            <input type="hidden" name="type" value={lessonType} />

            <div className="space-y-2">
              <label className="text-sm font-medium">Tiêu đề bài học</label>
              <Input name="title" placeholder="VD: 50 Idioms thông dụng" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loại bài học</label>
                <Select onValueChange={setLessonType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="HSG">Học sinh giỏi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phân mục</label>
                <Input name="category" placeholder="VD: Idioms" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nội dung bài học</label>
              <Textarea 
                name="content" 
                placeholder="Nhập kiến thức ở đây..." 
                rows={10} 
                required 
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Hủy
              </Button>
              <Button type="submit">Đăng bài học</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}