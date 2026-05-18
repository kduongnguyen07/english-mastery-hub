'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
// Trong lib/actions.ts
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

/**
 * 1. THÊM BÀI HỌC MỚI (Dành cho Admin)
 */
export async function createLesson(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const type = formData.get('type') as 'IELTS' | 'HSG';
  const category = formData.get('category') as string;

  await prisma.lesson.create({
    data: { title, content, type, category },
  });

  revalidatePath('/vault');
  redirect('/vault');
}

/**
 * 2. LƯU TỪ VỰNG VÀO FLASHCARD
 */
export async function saveVocabulary(word: string, meaning: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Chưa đăng nhập");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return;

  await prisma.vocabulary.create({
    data: {
      word,
      meaning,
      userId: user.id,
    },
  });

  revalidatePath('/flashcards');
}

/**
 * 3. XÓA TỪ VỰNG KHỎI FLASHCARD
 */
export async function deleteVocabulary(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.vocabulary.delete({
    where: { 
      id: id,
      user: { email: session.user?.email! } 
    },
  });

  revalidatePath('/flashcards');
}

/**
 * 4. ĐĂNG KÝ TÀI KHOẢN MỚI (Dành cho em trai)
 */
export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) throw new Error("Thiếu thông tin");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email đã tồn tại");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  redirect('/login');
}