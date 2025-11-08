import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        name: 'Administrator'
      }
    });
    console.log('Seeded admin user (admin / admin123)');
  } else {
    console.log('Admin user already exists');
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
