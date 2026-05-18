'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Plus } from 'lucide-react';
import { saveVocabulary } from '@/lib/actions';
import { toast } from 'sonner';

export default function DictionaryPage() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word) return;
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    if (res.ok) setResult(data[0]);
    else toast.error("Không tìm thấy từ này!");
  };

  return (
    // Bỏ mx-auto ở đây
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <span className="text-4xl">📖</span> Dictionary
        </h1>
        <p className="text-zinc-500">Tra cứu từ vựng chuẩn Cambridge Academic.</p>
      </header>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <Input 
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Type a word to search..." 
          className="h-12 pl-10 bg-notion-sidebar border-notion-border focus:ring-1 focus:ring-zinc-300 rounded-lg text-lg"
        />
      </form>

      {result && (
        <div className="space-y-6 border-t border-notion-border pt-8">
          <div className="flex items-baseline gap-4">
            <h2 className="text-5xl font-bold text-zinc-900">{result.word}</h2>
            <span className="text-xl text-zinc-400 font-mono">{result.phonetic}</span>
          </div>

          {result.meanings.map((m: any, i: number) => (
            <div key={i} className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 w-fit px-2 py-0.5 rounded">
                {m.partOfSpeech}
              </div>
              {m.definitions.slice(0, 2).map((def: any, di: number) => (
                <div key={di} className="group flex justify-between gap-4 p-4 hover:bg-notion-hover rounded-xl transition-colors">
                  <div className="space-y-2">
                    <p className="text-lg text-zinc-800 leading-relaxed">{def.definition}</p>
                    {def.example && <p className="text-sm text-zinc-500 italic">"{def.example}"</p>}
                  </div>
                  <button 
                    onClick={() => {
                      saveVocabulary(result.word, def.definition);
                      toast.success("Đã lưu vào Flashcards!");
                    }}
                    className="h-8 w-8 flex items-center justify-center bg-white border border-notion-border rounded-lg shadow-sm opacity-0 group-hover:opacity-100 hover:bg-zinc-50 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}