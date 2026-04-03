import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning database...');

  await prisma.auditLog.deleteMany();
  await prisma.importLog.deleteMany();
  await prisma.qrToken.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Clean failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
