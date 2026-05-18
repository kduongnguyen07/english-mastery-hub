import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="space-y-4">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Welcome back, {session?.user?.name || 'Scholar'}
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
          Hệ thống học tập cá nhân hóa. Hôm nay mày muốn chinh phục thêm bao nhiêu từ vựng mới?
        </p>
      </header>

      {/* Quick Links Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-notion-border pb-2">
            Current Focus
          </h2>
          <div className="space-y-1">
            <Link href="/vault" className="block p-2 rounded-lg hover:bg-notion-hover transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <div className="text-sm font-semibold group-hover:underline">The Vault</div>
                  <div className="text-xs text-zinc-400">Tiếp tục bài học IELTS Reading còn dang dở</div>
                </div>
              </div>
            </Link>
            <Link href="/flashcards" className="block p-2 rounded-lg hover:bg-notion-hover transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-xl">🧠</span>
                <div>
                  <div className="text-sm font-semibold group-hover:underline">Daily Review</div>
                  <div className="text-xs text-zinc-400">Mày có 15 từ cần ôn tập ngay bây giờ</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-notion-border pb-2">
            Resources
          </h2>
          <div className="space-y-1">
            <Link href="/dictionary" className="block p-2 rounded-lg hover:bg-notion-hover transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <div className="text-sm font-semibold group-hover:underline">Cambridge Dictionary</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}