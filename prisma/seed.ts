import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (be careful in production!)
  await prisma.activityLog.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  // Seed default system config
  await prisma.systemConfig.create({
    data: {
      key: 'system_config',
      value: JSON.stringify({
        auth: { pin: true, otp: false, face: true },
        device: { mode: 'strict' },
        geo: { mode: 'hybrid', radius: 50 },
        qr: { refresh: 10 },
        detection: { level: 'high' },
      }),
      description: 'System-wide configuration and feature toggles',
    },
  });

  // Seed demo users
  const hashedPin = await bcrypt.hash('1234', 10);
  const users = await Promise.all(
    [
      {
        nrp: '12345678',
        name: 'Kolonel Ahmad',
        rank: 'Kolonel',
        unit: 'Komando Pusat',
        pin: hashedPin,
      },
      {
        nrp: '87654321',
        name: 'Mayor Budi',
        rank: 'Mayor',
        unit: 'Divisi A',
        pin: hashedPin,
      },
      {
        nrp: '11223344',
        name: 'Kapten Citra',
        rank: 'Kapten',
        unit: 'Divisi B',
        pin: hashedPin,
      },
    ].map((user) =>
      prisma.user.create({
        data: user,
      }),
    ),
  );

  console.log(`✅ Created ${users.length} demo users`);
  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
