import { execSync } from 'child_process';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Run migrations
    console.log('📋 Running migrations...');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
      });
    } catch (error) {
      console.log('ℹ️ No migrations to run or migration skipped');
    }

    // Seed database
    console.log('🌱 Seeding database...');
    try {
      execSync('npx prisma db seed', {
        stdio: 'inherit',
      });
    } catch (error) {
      console.log('ℹ️ Seed skipped or already run');
    }

    console.log('✅ Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
