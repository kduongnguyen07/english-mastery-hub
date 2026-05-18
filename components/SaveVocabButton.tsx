'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { saveVocabulary } from '@/lib/actions';
import { toast } from 'sonner';

export function SaveVocabButton({ word, meaning }: { word: string, meaning: string }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-zinc-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
      onClick={async () => {
        try {
          await saveVocabulary(word, meaning);
          toast.success(`Đã thêm "${word}" vào Flashcards!`);
        } catch (err) {
          toast.error("Đăng nhập để lưu từ vựng nhé em trai!");
        }
      }}
    >
      <PlusCircle className="h-5 w-5" />
    </Button>
  );
}