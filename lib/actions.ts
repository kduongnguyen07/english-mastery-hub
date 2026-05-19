'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function createLesson(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as 'IELTS' | 'HSG';
  const category = formData.get('category') as string;

  await prisma.lesson.create({ data: { title, content, type, category } });
  revalidatePath('/vault');
  redirect('/vault');
}

export async function updateLesson(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as 'IELTS' | 'HSG';
  const category = formData.get('category') as string;

  await prisma.lesson.update({
    where: { id },
    data: { title, content, type, category },
  });

  revalidatePath(`/lessons/${id}`);
  revalidatePath('/vault');
  redirect(`/lessons/${id}`);
}

export async function saveVocabulary(word: string, meaning: string) {
  const session = await getServerSession(authOptions);
  // FIX: Chặn lỗi session.user is possibly undefined
  if (!session?.user?.email) throw new Error("Chưa đăng nhập");
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return;
  await prisma.vocabulary.create({ data: { word, meaning, userId: user.id } });
  revalidatePath('/flashcards');
}

export async function deleteVocabulary(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  await prisma.vocabulary.delete({ where: { id, user: { email: session.user.email } } });
  revalidatePath('/flashcards');
}

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashedPassword, role: 'STUDENT' } });
  redirect('/login');
}

export async function searchLocalVault(query: string) {
  const lessons = await prisma.lesson.findMany({
    where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { content: { contains: query, mode: 'insensitive' } }] },
    take: 5,
  });
  // FIX: Khai báo rõ l là bài học, line là string
  return lessons.map((l: any) => ({
    id: l.id,
    title: l.title,
    matchedContent: l.content.split('\n').find((line: string) => line.toLowerCase().includes(query.toLowerCase())) || l.title,
    type: l.type
  }));
}

export async function createDeck(formData: FormData) {
  const name = formData.get('name') as string;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return;
  
  await prisma.deck.create({ data: { name, userId: user.id } });
  revalidatePath('/flashcards');
}
export async function updateVocabDeck(vocabId: string, deckId: string | null) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  await prisma.vocabulary.update({
    where: { id: vocabId, user: { email: session.user.email } },
    data: { deckId }
  });
  revalidatePath('/flashcards/manage');
  revalidatePath('/flashcards');
}

export async function deleteDeck(deckId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  // Chuyển các từ trong Deck này về "Chưa phân loại" trước khi xóa
  await prisma.vocabulary.updateMany({
    where: { deckId, user: { email: session.user.email } },
    data: { deckId: null }
  });
  await prisma.deck.delete({
    where: { id: deckId, user: { email: session.user.email } }
  });
  revalidatePath('/flashcards');
}
export async function bulkUpdateVocabDeck(vocabIds: string[], deckId: string | null) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  
  await prisma.vocabulary.updateMany({
    where: { 
      id: { in: vocabIds },
      user: { email: session.user.email } 
    },
    data: { deckId }
  });
  
  revalidatePath('/flashcards/manage');
  revalidatePath('/flashcards');
}