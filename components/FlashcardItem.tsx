'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Trash2, RotateCw } from 'lucide-react';
import { deleteVocabulary } from '@/lib/actions';
import { toast } from 'sonner';

export function FlashcardItem({ word, meaning, index, id }: { word: string; meaning: string; index: number; id: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Xóa từ "${word}"?`)) {
      try {
        await deleteVocabulary(id);
        toast.success("Đã xóa!");
      } catch (error) {
        toast.error("Lỗi xóa từ.");
      }
    }
  };

  return (
    <div 
      className="perspective-1000 h-64 w-full cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "relative h-full w-full transition-all duration-500 preserve-3d shadow-sm rounded-xl border border-notion-border",
        isFlipped ? "rotate-y-180" : ""
      )}>
        
        {/* MẶT TRƯỚC: TIẾNG ANH */}
        <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-white p-6 rounded-xl">
          <span className="absolute top-4 left-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            #{index + 1}
          </span>
          <h3 className="text-2xl font-bold text-zinc-800 text-center leading-tight">
            {word}
          </h3>
          <div className="mt-4 flex items-center gap-1 text-zinc-400 text-[10px] font-bold uppercase">
            <RotateCw className="w-3 h-3" /> Tap to flip
          </div>
          
          <button onClick={handleDelete} className="absolute top-4 right-4 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded text-red-400 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* MẶT SAU: NGHĨA (Xoay 180 độ) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-[#fbfbfa] p-6 rounded-xl border-2 border-blue-100">
          <span className="absolute top-4 left-4 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Meaning
          </span>
          <p className="text-xl font-medium text-zinc-700 text-center leading-relaxed">
            {meaning}
          </p>
        </div>

      </div>
    </div>
  );
}