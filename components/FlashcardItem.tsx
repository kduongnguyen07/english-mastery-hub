'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // QUAN TRỌNG: Phải có dòng này
import { cn } from '@/lib/utils';
import { Languages, Sparkles, Trash2 } from 'lucide-react';
import { deleteVocabulary } from '@/lib/actions';
import { toast } from 'sonner';

/**
 * Component thẻ Flashcard có tính năng lật và xóa.
 */
export function FlashcardItem({ 
  word, 
  meaning, 
  index, 
  id 
}: { 
  word: string; 
  meaning: string; 
  index: number; 
  id: string 
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Hàm xử lý xóa từ vựng
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn không cho thẻ bị lật khi bấm nút xóa
    if (confirm(`Mày chắc chắn muốn xóa từ "${word}" chứ?`)) {
      try {
        await deleteVocabulary(id);
        toast.success("Đã xóa từ vựng thành công!");
      } catch (error) {
        toast.error("Có lỗi khi xóa từ.");
      }
    }
  };

  return (
    <div 
      className="perspective-1000 h-64 w-full cursor-pointer group relative"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* NÚT XÓA - Hiện lên khi di chuột vào Card */}
      <Button 
        onClick={handleDelete}
        variant="destructive" 
        size="icon" 
        className="absolute -top-2 -right-2 z-30 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className={cn(
        "relative h-full w-full transition-all duration-700 preserve-3d",
        isFlipped ? "[transform:rotateY(180deg)]" : ""
      )}>
        {/* MẶT TRƯỚC: TIẾNG ANH */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-shadow rounded-3xl p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <span className="absolute top-6 left-6 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Card #{index + 1}</span>
          <Sparkles className="absolute top-6 right-6 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h3 className="text-3xl font-black text-zinc-800 tracking-tight text-center px-4">
            {word}
          </h3>
          
          <div className="mt-6 flex items-center gap-2 text-zinc-400">
            <Languages className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Tap to flip</span>
          </div>
        </Card>

        {/* MẶT SAU: TIẾNG VIỆT */}
        <Card className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 border-none rounded-3xl p-8 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <span className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Meaning</span>
          <p className="text-white text-xl md:text-2xl font-bold leading-relaxed z-10">
            {meaning}
          </p>
          <div className="mt-8 h-1 w-12 bg-white/30 rounded-full"></div>
        </Card>
      </div>
    </div>
  );
}