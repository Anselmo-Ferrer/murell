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

  // Create columns
  const column1 = await prisma.column.create({
    data: {
      title: 'To Do',
      position: 0,
      boardId: board.id,
    },
  });

  const column2 = await prisma.column.create({
    data: {
      title: 'In Progress',
      position: 1,
      boardId: board.id,
    },
  });

  const column3 = await prisma.column.create({
    data: {
      title: 'Done',
      position: 2,
      boardId: board.id,
    },
  });

  console.log('✅ Created columns');

  // Create labels
  const label1 = await prisma.label.upsert({
    where: { name_color: { name: 'Important', color: 'red' } },
    update: {},
    create: {
      name: 'Important',
      color: 'red',
    },
  });

  const label2 = await prisma.label.upsert({
    where: { name_color: { name: 'Bug', color: 'purple' } },
    update: {},
    create: {
      name: 'Bug',
      color: 'purple',
    },
  });

  console.log('✅ Created labels');

  // Create cards
  const card1 = await prisma.card.create({
    data: {
      title: 'Welcome to Murell!',
      description: 'This is your first card. You can edit, move, and organize it.',
      position: 0,
      columnId: column1.id,
      labels: {
        create: {
          labelId: label1.id,
        },
      },
    },
  });

  const card2 = await prisma.card.create({
    data: {
      title: 'Create your first task',
      description: 'Add more cards to organize your work',
      position: 1,
      columnId: column1.id,
    },
  });

  console.log('✅ Created cards');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

