'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Sửa dòng này
import bcrypt from 'bcryptjs';

// ... (Giữ nguyên toàn bộ các hàm createLesson, saveVocabulary, deleteVocabulary, registerUser bên dưới)
// Đảm bảo hàm searchLocalVault cũng nằm trong này nếu mày đã thêm nó ở bước trước.

export async function createLesson(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as 'IELTS' | 'HSG';
  const category = formData.get('category') as string;
  await prisma.lesson.create({ data: { title, content, type, category } });
  revalidatePath('/vault');
  redirect('/vault');
}

export async function saveVocabulary(word: string, meaning: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Chưa đăng nhập");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return;
  await prisma.vocabulary.create({ data: { word, meaning, userId: user.id } });
  revalidatePath('/flashcards');
}

export async function deleteVocabulary(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  await prisma.vocabulary.delete({ where: { id: id, user: { email: session.user?.email! } } });
  revalidatePath('/flashcards');
}

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if (!name || !email || !password) throw new Error("Thiếu thông tin");
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email đã tồn tại");
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashedPassword, role: 'STUDENT' } });
  redirect('/login');
}

export async function searchLocalVault(query: string) {
  const lessons = await prisma.lesson.findMany({
    where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { content: { contains: query, mode: 'insensitive' } }] },
    take: 5,
  });
  return lessons.map(lesson => {
    const lines = lesson.content.split('\n');
    const matchedLine = lines.find(line => line.toLowerCase().includes(query.toLowerCase()));
    return { id: lesson.id, title: lesson.title, matchedContent: matchedLine || lesson.title, type: lesson.type };
  });
}
/**
 * Cập nhật nội dung bài học đã có.
 */
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