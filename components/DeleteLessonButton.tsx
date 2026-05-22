'use client';

import { Trash2 } from 'lucide-react';
import { deleteLesson } from '@/lib/actions';
import { toast } from 'sonner';

/**
 * Client-side button to handle lesson deletion with confirmation.
 */
export function DeleteLessonButton({ id, title }: { id: string; title: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn việc bấm vào card lôi vào trang chi tiết
    if (confirm(`Mày chắc chắn muốn xoá bài "${title}" chứ?`)) {
      try {
        await deleteLesson(id);
        toast.success("Đã xoá bài học thành công!");
      } catch (error: any) {
        toast.error(error.message || "Lỗi khi xoá bài.");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
      title="Xoá bài học"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}