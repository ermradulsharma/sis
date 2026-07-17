import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import models
import Role from '../src/features/roles/models/role.model';
import User from '../src/features/users/models/user.model';
import CompanySettings from '../src/features/company-settings/models/company-settings.model';
import { getAllPermissions } from '../src/config/permissions';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected successfully.\n');

    // ==========================================
    // 1. Create Super Admin Role
    // ==========================================
    console.log('Seeding Super Admin Role...');
    let superAdminRole = await Role.findOne({ name: 'super-admin' });
    
    // Get all permissions
    const allPermissions = getAllPermissions();

    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'super-admin',
        description: 'Super Administrator with unrestricted access to all modules.',
        permissions: allPermissions,
        isSystem: true,
      });
      console.log('-> Created super-admin role.');
    } else {
      // Ensure super-admin always has all permissions
      superAdminRole.permissions = allPermissions;
      await superAdminRole.save();
      console.log('-> Updated super-admin role permissions.');
    }

    // ==========================================
    // 2. Create Admin User
    // ==========================================
    console.log('\nSeeding Admin User...');
    const adminEmail = 'admin@sis-erp.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      adminUser = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword, // Note: bypass pre-save hook since we hash it here directly, but the model has a pre-save hook, so let's just pass plain text to trigger the hook.
        roleId: superAdminRole._id,
        status: 'active',
      });
      
      // Since we passed hashed password, we need to bypass pre-save if we hash it manually.
      // Actually, passing plain text to `User.create` will trigger the pre-save hook and hash it correctly.
      // Let's rewrite the creation to just use plain text so the schema hook does the work.
      await User.findByIdAndDelete(adminUser._id);

      adminUser = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'password123', // Will be hashed by pre-save hook
        roleId: superAdminRole._id,
        status: 'active',
      });

      console.log(`-> Created admin user. Email: ${adminEmail} / Password: password123`);
    } else {
      console.log(`-> Admin user already exists. Email: ${adminEmail}`);
    }

    // ==========================================
    // 3. Create Default Company Settings
    // ==========================================
    console.log('\nSeeding Company Settings...');
    const settingsCount = await CompanySettings.countDocuments();

    if (settingsCount === 0) {
      await CompanySettings.create({
        companyName: 'SIS Software Solutions',
        email: 'info@sis-erp.com',
        timezone: 'UTC',
        currency: 'USD',
      });
      console.log('-> Created default company settings.');
    } else {
      console.log('-> Company settings already exist.');
    }

    console.log('\nSeed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\nSeed failed with error:', error);
    process.exit(1);
  }
}

seedDatabase();
