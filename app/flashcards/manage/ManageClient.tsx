'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bulkUpdateVocabDeck, deleteVocabulary } from '@/lib/actions';
import { Trash2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageClient({ vocabs, decks }: { vocabs: any[], decks: any[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targetDeck, setTargetDeck] = useState('null');
  const [isUpdating, setIsUpdating] = useState(false);

  // Chọn / Bỏ chọn 1 dòng
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Chọn tất cả
  const toggleSelectAll = () => {
    if (selectedIds.length === vocabs.length) setSelectedIds([]);
    else setSelectedIds(vocabs.map(v => v.id));
  };

  // NÚT LƯU TẤT CẢ (Apply to all selected)
  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) return toast.error("Chưa chọn từ nào!");
    setIsUpdating(true);
    try {
      await bulkUpdateVocabDeck(selectedIds, targetDeck === 'null' ? null : targetDeck);
      toast.success(`Đã chuyển ${selectedIds.length} từ vào thư mục thành công!`);
      setSelectedIds([]); // Reset chọn
      router.refresh(); // F5 lại data
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsUpdating(false);
    }
  };

  // Xóa 1 từ
  const handleDelete = async (id: string) => {
    if(!confirm("Chắc chắn xóa từ này?")) return;
    try {
      await deleteVocabulary(id);
      toast.success("Đã xóa từ vựng!");
      router.refresh();
    } catch (e) {
      toast.error("Lỗi khi xóa!");
    }
  };

  return (
    <div className="space-y-4">
      {/* THANH CÔNG CỤ (BULK ACTION) - XUẤT HIỆN KHI CÓ TỪ ĐƯỢC CHỌN */}
      <div className={`p-4 bg-zinc-900 rounded-xl flex items-center justify-between text-white transition-all ${selectedIds.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none hidden'}`}>
        <div className="flex items-center gap-2 font-medium">
          <CheckSquare className="w-5 h-5 text-blue-400" /> Đã chọn {selectedIds.length} từ
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">Chuyển tất cả vào:</span>
          <select 
            value={targetDeck} 
            onChange={(e) => setTargetDeck(e.target.value)}
            className="h-9 px-3 bg-zinc-800 border border-zinc-700 rounded-md text-sm outline-none focus:border-blue-500"
          >
            <option value="null">📂 Chưa phân loại</option>
            {decks.map(d => <option key={d.id} value={d.id}>📁 {d.name}</option>)}
          </select>
          <button 
            onClick={handleBulkUpdate} disabled={isUpdating}
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Đang chuyển...' : 'Áp dụng'}
          </button>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="border border-notion-border rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fbfbfa] border-b border-notion-border text-zinc-500">
            <tr>
              <th className="px-6 py-4 w-12">
                <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === vocabs.length && vocabs.length > 0} className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-6 py-4 font-bold">Từ vựng</th>
              <th className="px-6 py-4 font-bold">Ý nghĩa</th>
              <th className="px-6 py-4 font-bold">Thư mục hiện tại</th>
              <th className="px-6 py-4 font-bold w-20 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-notion-border">
            {vocabs.map((v) => (
              <tr key={v.id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.includes(v.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedIds.includes(v.id)} onChange={() => toggleSelect(v.id)} className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </td>
                <td className="px-6 py-4 font-bold text-zinc-900">{v.word}</td>
                <td className="px-6 py-4 text-zinc-600 max-w-[300px] truncate" title={v.meaning}>{v.meaning}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700">
                    {v.deckId ? `📁 ${decks.find(d=>d.id === v.deckId)?.name}` : '📂 Chưa phân loại'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}