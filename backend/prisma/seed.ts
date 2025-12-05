import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      bio: 'Test user for development',
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create a sample board
  const board = await prisma.board.create({
    data: {
      title: 'My First Board',
      description: 'This is a sample board',
      color: 'blue',
      creatorId: user.id,
      isPublic: false,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
    },
  });

  console.log('✅ Created board:', board.title);

}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

