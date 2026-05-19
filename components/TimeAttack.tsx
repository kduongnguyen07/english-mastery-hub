'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trophy, Timer, Flame, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuizItem = {
  id: string;
  word: string;
  correctMeaning: string;
  options: string[];
};

export function TimeAttack({ questions }: { questions: QuizItem[] }) {
  const router = useRouter();
  const [pool, setPool] = useState<QuizItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const shufflePool = useCallback(() => {
    return [...questions].sort(() => 0.5 - Math.random());
  }, [questions]);

  const startGame = () => {
    const newPool = shufflePool();
    setPool(newPool);
    setCurrentQuestion(newPool[0]);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setIsFinished(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleSelect = (option: string) => {
    if (!currentQuestion) return;

    if (option === currentQuestion.correctMeaning) {
      const points = 10 + combo * 2;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      
      const nextIndex = pool.findIndex(q => q.id === currentQuestion.id) + 1;
      if (nextIndex < pool.length) {
        setCurrentQuestion(pool[nextIndex]);
      } else {
        const nextPool = shufflePool();
        setPool(nextPool);
        setCurrentQuestion(nextPool[0]);
      }
    } else {
      setCombo(0);
      setTimeLeft((t) => Math.max(0, t - 3));
      toast.error('Sai! Bị trừ 3 giây!', { icon: <XCircle className="text-red-500" /> });
    }
  };

  if (questions.length < 4) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
        <span className="text-4xl mb-4">📭</span>
        <p>Cần ít nhất 4 từ để chơi chế độ này.</p>
      </div>
    );
  }

  if (!isPlaying && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <Timer className="w-24 h-24 text-blue-500" />
        <h2 className="text-5xl font-black text-notion-text tracking-tighter">Time Attack</h2>
        <p className="text-xl text-zinc-500">60 giây sinh tồn. Trả lời nhanh, giữ combo.</p>
        <button 
          onClick={startGame}
          className="mt-8 px-10 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition-all active:scale-95"
        >
          Bắt đầu ngay
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 animate-in zoom-in text-center">
        <Trophy className="w-24 h-24 text-yellow-500" />
        <h2 className="text-5xl font-black text-notion-text tracking-tighter">Hết giờ!</h2>
        <p className="text-xl text-zinc-500">Điểm của mày: <span className="font-bold text-zinc-900">{score}</span></p>
        <div className="flex gap-4 mt-8">
          <button 
            onClick={startGame}
            className="px-8 py-4 bg-zinc-100 text-zinc-900 font-bold rounded-xl shadow-sm hover:bg-zinc-200 transition-all"
          >
            Chơi lại
          </button>
          <button 
            onClick={() => router.push('/flashcards')}
            className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition-all"
          >
            Thoát
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center space-y-8 py-10">
      <div className="w-full flex justify-between items-center px-4 bg-white border border-notion-border p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Timer className={cn("w-6 h-6", timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-500")} />
          <span className={cn("text-2xl font-black font-mono", timeLeft <= 10 ? "text-red-500" : "text-zinc-900")}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Score</span>
            <span className="text-xl font-black text-zinc-900">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Combo</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-orange-500">{combo}</span>
              <Flame className={cn("w-5 h-5 text-orange-500", combo >= 3 ? "fill-orange-500 animate-bounce" : "")} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-2 border-notion-border rounded-[32px] p-10 md:p-16 shadow-sm text-center">
        <h2 className="text-5xl md:text-7xl font-black text-notion-text tracking-tighter leading-tight break-words">
          {currentQuestion?.word}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {currentQuestion?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            className="flex items-center justify-center min-h-20 p-6 rounded-2xl border-2 border-notion-border bg-white hover:bg-notion-hover text-zinc-700 text-lg font-medium transition-all text-left active:scale-95"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}