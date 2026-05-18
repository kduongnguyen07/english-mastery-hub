'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Volume2, 
  Plus, 
  ExternalLink, 
  GraduationCap, 
  Image as ImageIcon, 
  Lightbulb,
  Library,
  ArrowRight
} from 'lucide-react';
import { saveVocabulary, searchLocalVault } from '../../lib/actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; 
import Link from 'next/link';

/**
 * Smart Dictionary Page - Cambridge Edition with Idiom Support
 * @returns {JSX.Element}
 */
export default function DictionaryPage() {
  const { data: session } = useSession(); 
  const [word, setWord] = useState('');
  const [result, setResult] = useState<any>(null);
  const [localResults, setLocalResults] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word) return;
    setLoading(true);
    setLocalResults([]); // Reset kết quả cũ
    
    try {
      // 1. TÌM TRONG KHO BÀI HỌC (Dành cho Idioms/Phrases)
      const local = await searchLocalVault(word);
      setLocalResults(local);

      // 2. TRA TỪ ĐIỂN NGOẠI (Dành cho từ đơn)
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const dictData = await dictRes.json();

      // 3. TRA HÌNH ẢNH
      const imgRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${word}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_KEY}&per_page=1`
      );
      const imgData = await imgRes.json();

      if (dictRes.ok) {
        setResult(dictData[0]);
        setImageUrl(imgData.results[0]?.urls?.regular || '');
      } else {
        setResult(null);
        if (local.length === 0) {
          toast.error("Không tìm thấy từ hoặc Idiom này!");
        }
      }
    } catch (error) {
      toast.error("Lỗi kết nối hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (type: 'uk' | 'us') => {
    const audio = result?.phonetics.find((p: any) => p.audio?.includes(type))?.audio 
               || result?.phonetics.find((p: any) => p.audio)?.audio;
    if (audio) new Audio(audio).play();
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] pb-20">
      {/* CAMBRIDGE HEADER */}
      <div className="bg-[#003366] pt-16 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <GraduationCap className="h-64 w-64 -rotate-12 translate-x-20 -translate-y-10 text-white" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-serif font-bold text-white mb-8 flex items-center justify-center gap-3">
            Cambridge Visual Dictionary
          </h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Input 
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Tra từ hoặc Idioms (VD: pull your socks up)..." 
              className="h-16 pl-14 pr-36 rounded-2xl border-none shadow-2xl text-xl focus-visible:ring-yellow-400"
            />
            <Search className="absolute left-5 top-5 h-6 w-6 text-zinc-400" />
            <Button type="submit" disabled={loading} className="absolute right-2 top-2 h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-xl px-8">
              {loading ? '...' : 'SEARCH'}
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* PHẦN 1: KẾT QUẢ TỪ KHO BÀI HỌC (THE VAULT) */}
        {localResults.length > 0 && (
          <div className="mb-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 text-[#003366]">
              <Library className="h-5 w-5" />
              <h3 className="font-black uppercase tracking-widest text-xs">Found in your Lessons</h3>
            </div>
            <div className="grid gap-3">
              {localResults.map((res) => (
                <Link href={`/lessons/${res.id}`} key={res.id}>
                  <Card className="border-l-4 border-l-yellow-400 hover:bg-white transition-all cursor-pointer shadow-md group">
                    <CardContent className="p-5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-zinc-800 group-hover:text-blue-600 transition-colors">
                          {res.matchedContent}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">Nguồn: {res.title} • {res.type}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN 2: KẾT QUẢ TỪ ĐIỂN QUỐC TẾ */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-xl rounded-[32px] bg-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-6xl font-serif font-bold text-[#003366] mb-4">{result.word}</h2>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
                        <span className="text-[10px] font-black text-red-600">UK</span>
                        <Volume2 onClick={() => playAudio('uk')} className="h-4 w-4 text-red-600 cursor-pointer" />
                        <span className="text-sm font-mono text-zinc-500">{result.phonetic}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                        <span className="text-[10px] font-black text-blue-600">US</span>
                        <Volume2 onClick={() => playAudio('us')} className="h-4 w-4 text-blue-600 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <a href={`https://dictionary.cambridge.org/dictionary/english/${result.word}`} target="_blank">
                    <Button variant="outline" className="rounded-full gap-2 border-zinc-200 text-zinc-500">
                      Full Cambridge <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </Card>

              {result.meanings.map((m: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">{m.partOfSpeech}</span>
                    <div className="h-px flex-1 bg-zinc-200"></div>
                  </div>
                  {m.definitions.slice(0, 2).map((def: any, di: number) => (
                    <Card key={di} className="border-none shadow-sm rounded-2xl bg-white group">
                      <CardContent className="p-6 flex justify-between gap-4">
                        <div>
                          <p className="text-lg text-zinc-800 leading-relaxed mb-3 font-medium">{def.definition}</p>
                          {def.example && (
                            <div className="flex gap-2 text-zinc-500 italic bg-zinc-50 p-4 rounded-xl border-l-4 border-blue-600">
                              <Lightbulb className="h-4 w-4 text-blue-600 shrink-0" />
                              <p>"{def.example}"</p>
                            </div>
                          )}
                        </div>
                        <Button onClick={() => saveVocabulary(result.word, def.definition)} variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 rounded-full">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
                  <div className="p-4 border-b border-zinc-50 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Visual Aid</span>
                  </div>
                  {imageUrl ? (
                    <img src={imageUrl} alt={word} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="h-64 bg-zinc-100 flex items-center justify-center text-zinc-300 italic text-sm">No image found</div>
                  )}
                </Card>
                
                <div className="p-6 bg-yellow-50 rounded-[32px] border border-yellow-100">
                  <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Tip for {session?.user?.name || 'Học viên'}
                  </h4>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Dân ôn HSG nên chú ý các ví dụ (Examples) để học cách dùng từ trong ngữ cảnh (Context).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}