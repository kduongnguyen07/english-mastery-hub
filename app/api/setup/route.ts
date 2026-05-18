import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Kiểm tra xem đã có tài khoản admin chưa
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gmail.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Tài khoản Admin đã tồn tại!' });
    }

    // Mã hóa mật khẩu '123456'
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo tài khoản
    await prisma.user.create({
      data: {
        name: 'Admin (Anh Trai)',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ message: 'Tạo tài khoản Admin thành công!' });
  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
  }
}