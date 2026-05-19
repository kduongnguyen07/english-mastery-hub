'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveFailedWords } from '@/lib/actions';
import { toast } from 'sonner';
import { Trophy, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuizItem = {
  id: string;
  word: string;
  correctMeaning: string;
  options: string[];
};

export function QuizMode({ questions }: { questions: QuizItem[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 animate-in fade-in">
        <span className="text-4xl mb-4">📭</span>
        <p>Kho từ vựng chưa đủ để tạo bài test (Cần ít nhất 4 từ).</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return; // Chặn click nhiều lần
    setSelectedOption(option);

    if (option === currentQuestion.correctMeaning) {
      setScore(s => s + 1);
    } else {
      setFailedIds(prev => [...prev, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await saveFailedWords(failedIds);
      if (failedIds.length > 0) {
        toast.success(`Đã tự động chuyển ${failedIds.length} từ sai vào thư mục "Từ hay sai"`);
      }
      router.push('/flashcards');
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi khi lưu kết quả!");
    } finally {
      setIsSaving(false);
    }
  };

  // Giao diện khi hoàn thành bài Test
  if (isFinished) {
    const isPerfect = score === questions.length;
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in zoom-in duration-500 text-center">
        <Trophy className={cn("w-24 h-24", isPerfect ? "text-yellow-500" : "text-zinc-400")} />
        <h2 className="text-5xl font-black text-notion-text tracking-tighter">
          {isPerfect ? "Quá đỉnh!" : "Hoàn thành!"}
        </h2>
        <p className="text-xl text-zinc-500">
          Mày đúng được <span className="font-bold text-zinc-900">{score}/{questions.length}</span> câu.
        </p>
        <button 
          onClick={handleFinish}
          disabled={isSaving}
          className="mt-8 px-10 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? "Đang lưu..." : "Lưu kết quả & Thoát"}
        </button>
      </div>
    );
  }

  // Giao diện câu hỏi hiện tại
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-12 py-10 animate-in fade-in">
      
      {/* Thanh tiến độ */}
      <div className="w-full space-y-4">
        <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-2">
          <span>Câu {currentIndex + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full h-2.5 bg-notion-border rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Thẻ câu hỏi */}
      <div className="w-full bg-white border-2 border-notion-border rounded-[32px] p-10 md:p-16 shadow-sm text-center">
        <h2 className="text-5xl md:text-7xl font-black text-notion-text tracking-tighter leading-tight break-words">
          {currentQuestion.word}
        </h2>
      </div>

      {/* Các lựa chọn đáp án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.correctMeaning;
          const showStatus = selectedOption !== null;

          let btnClass = "bg-white border-notion-border hover:bg-notion-hover text-zinc-700";
          
          if (showStatus) {
            if (isCorrect) {
              btnClass = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-500 ring-offset-2";
            } else if (isSelected && !isCorrect) {
              btnClass = "bg-red-100 border-red-500 text-red-800 ring-2 ring-red-500 ring-offset-2";
            } else {
              btnClass = "bg-white border-notion-border opacity-50";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={showStatus}
              className={cn(
                "relative flex items-center justify-center min-h-20 p-6 rounded-2xl border-2 text-lg font-medium transition-all text-left",
                btnClass
              )}
            >
              {option}
              {showStatus && isCorrect && <CheckCircle2 className="absolute right-4 w-6 h-6 text-green-600" />}
              {showStatus && isSelected && !isCorrect && <XCircle className="absolute right-4 w-6 h-6 text-red-600" />}
            </button>
          );
        })}
      </div>

      {/* Nút Next (chỉ hiện khi đã chọn đáp án) */}
      <div className={cn("transition-all duration-300", selectedOption ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold rounded-full shadow-lg hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
        >
          {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}