'use client';

import { useState, useRef } from 'react';
import { RotateCw, Check, X, Trophy } from 'lucide-react';
import Link from 'next/link';

type Vocab = { id: string; word: string; meaning: string };

export function FocusStudy({ vocabs }: { vocabs: Vocab[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  if (vocabs.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500 animate-in fade-in"><span className="text-4xl mb-4">📭</span><p>Thư mục này chưa có từ vựng.</p></div>
  );
  
  if (currentIndex >= vocabs.length) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 animate-in zoom-in duration-500 text-center">
      <Trophy className="w-24 h-24 text-yellow-500" />
      <h2 className="text-5xl font-black text-notion-text tracking-tighter">Hoàn thành xuất sắc!</h2>
      <p className="text-xl text-zinc-500">Mày đã học xong {learnedCount}/{vocabs.length} từ vựng.</p>
      <Link href="/flashcards" className="mt-8 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
        Quay về Kho Decks
      </Link>
    </div>
  );

  const currentVocab = vocabs[currentIndex];

  const handleNext = (learned: boolean) => {
    // ÉP THẺ BAY MẤT HÚT KHỎI MÀN HÌNH (Văng 2000px)
    setDragX(learned ? 2000 : -2000); 
    setTimeout(() => {
      setIsFlipped(false);
      setDragX(0); 
      if (learned) setLearnedCount(c => c + 1);
      setCurrentIndex(i => i + 1);
    }, 300); 
  };

  const onDragStart = (clientX: number) => { startX.current = clientX; setIsDragging(true); };
  const onDragMove = (clientX: number) => { if (!isDragging) return; setDragX(clientX - startX.current); };
  const onDragEnd = () => {
    setIsDragging(false);
    if (dragX > 150) handleNext(true); 
    else if (dragX < -150) handleNext(false); 
    else if (Math.abs(dragX) < 5) setIsFlipped(!isFlipped); 
    else setDragX(0); 
  };

  return (
    // BỎ max-w-4xl, BỎ overflow-hidden. Cho w-full để tràn hết màn hình máy tính.
    <div className="w-full h-full flex flex-col items-center justify-center space-y-12 relative py-10">
      
      {/* THANH TIẾN ĐỘ RỘNG RÃI */}
      <div className="w-full max-w-4xl space-y-4 z-0">
        <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-2">
          <span>Tiến độ: {currentIndex + 1} / {vocabs.length}</span>
          <span>Đã thuộc: {learnedCount}</span>
        </div>
        <div className="w-full h-2.5 bg-notion-border rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out" 
            style={{ width: `${(currentIndex / vocabs.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* THẺ HÌNH CHỮ NHẬT NGANG (HCN) SIÊU TO (max-w-5xl) */}
      <div 
        ref={cardRef}
        className="perspective-1000 w-full max-w-5xl h-[450px] md:h-[500px] cursor-grab active:cursor-grabbing group z-50"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={() => { if(isDragging) onDragEnd(); }}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.02}deg)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <div className={`relative h-full w-full preserve-3d shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[40px] border-2 ${dragX > 100 ? 'border-green-500' : dragX < -100 ? 'border-red-500' : 'border-notion-border'} bg-notion-bg ${isFlipped ? 'rotate-y-180' : ''}`}
             style={{ transition: isDragging ? 'none' : 'transform 0.6s ease' }}>
          
          {/* STAMPS LIKE TINDER */}
          <div className={`absolute top-12 right-12 border-8 border-green-500 text-green-500 font-black text-6xl px-8 py-4 rounded-3xl rotate-12 opacity-0 z-50 transition-opacity ${dragX > 100 && 'opacity-100'}`}>LIKE</div>
          <div className={`absolute top-12 left-12 border-8 border-red-500 text-red-500 font-black text-6xl px-8 py-4 rounded-3xl -rotate-12 opacity-0 z-50 transition-opacity ${dragX < -100 && 'opacity-100'}`}>NOPE</div>

          {/* MẶT TRƯỚC (TERM) */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 rounded-[40px] select-none bg-notion-bg">
            <div className="w-full h-full flex items-center justify-center overflow-y-auto custom-scrollbar">
              <h2 className="text-6xl md:text-8xl font-black text-notion-text text-center tracking-tighter leading-tight pointer-events-none break-words w-full px-4">
                {currentVocab.word}
              </h2>
            </div>
            <div className="absolute bottom-10 flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] bg-notion-sidebar px-6 py-3 rounded-full pointer-events-none shadow-sm">
              <RotateCw className="w-4 h-4" /> CLICK TO FLIP • SWIPE TO SELECT
            </div>
          </div>

          {/* MẶT SAU (MEANING) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center bg-notion-sidebar p-12 rounded-[40px] select-none">
            <span className="absolute top-10 left-12 text-sm font-black text-blue-500 uppercase tracking-[0.3em] bg-blue-500/10 px-4 py-2 rounded-xl pointer-events-none">Definition</span>
            
            <div className="w-full h-full flex items-center justify-center overflow-y-auto mt-10 custom-scrollbar">
              <p className="text-3xl md:text-5xl font-medium text-notion-text text-center leading-relaxed pointer-events-none w-full break-words px-4">
                {currentVocab.meaning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NÚT ĐIỀU KHIỂN TO TRÒN CHUẨN TINDER */}
      <div className={`flex items-center gap-12 w-full justify-center transition-all duration-500 z-0 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button 
          onClick={() => handleNext(false)} 
          className="w-24 h-24 rounded-full flex items-center justify-center bg-notion-bg border-4 border-notion-border hover:border-red-500 hover:scale-110 text-red-500 shadow-2xl active:scale-90 transition-all group"
        >
          <X className="w-12 h-12 stroke-[4]" />
        </button>
        <button 
          onClick={() => handleNext(true)} 
          className="w-24 h-24 rounded-full flex items-center justify-center bg-notion-bg border-4 border-notion-border hover:border-green-500 hover:scale-110 text-green-500 shadow-2xl active:scale-90 transition-all group"
        >
          <Check className="w-12 h-12 stroke-[4]" />
        </button>
      </div>

    </div>
  );
}