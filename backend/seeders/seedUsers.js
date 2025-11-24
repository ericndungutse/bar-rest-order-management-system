import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@yopmain.com',
    password: 'Test@123',
    roles: ['admin'],
    phone: '1234567890',
  },
  {
    name: 'Manager User',
    email: 'manager@yopmain.com',
    password: 'Test@123',
    roles: ['manager'],
    phone: '1234567891',
  },
  {
    name: 'Waiter User',
    email: 'waiter@yopmain.com',
    password: 'Test@123',
    roles: ['waiter'],
    phone: '1234567892',
  },
  // New admin "one love" and his associated manager & waiter
  {
    name: 'one love',
    email: 'onelove@yopmain.com',
    password: 'Test@123',
    roles: ['admin'],
    phone: '1234567893',
  },
  {
    name: 'One Love Manager',
    email: 'manager-onelove@yopmain.com',
    password: 'Test@123',
    roles: ['manager'],
    phone: '1234567894',
    bossEmail: 'onelove@yopmain.com',
  },
  {
    name: 'One Love Waiter',
    email: 'waiter-onelove@yopmain.com',
    password: 'Test@123',
    roles: ['waiter'],
    phone: '1234567895',
    bossEmail: 'onelove@yopmain.com',
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    // Do not clear the database. If a user already exists (by email), skip creating them.

    // Create all admins first and keep a map of email -> created admin
    const adminEntries = users.filter((u) => u.roles?.includes('admin'));
    const adminMap = new Map();

    for (const adminData of adminEntries) {
      // If admin already exists by email, reuse it and skip creation
      let admin = await User.findOne({ email: adminData.email });
      if (admin) {
        adminMap.set(admin.email, admin);
        console.log(`Admin already exists: ${admin.name} (${admin.email}) - ID: ${admin._id}`);
        continue;
      }

      admin = new User(adminData);
      await admin.save();
      adminMap.set(admin.email, admin);
      console.log(`Admin user created: ${admin.name} (${admin.email}) - ID: ${admin._id}`);
    }

    // Insert non-admin users and attach boss reference.
    const nonAdmins = users.filter((u) => !u.roles?.includes('admin'));
    for (const u of nonAdmins) {
      // Skip creation if a user with this email already exists
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User already exists, skipping: ${existing.name} (${existing.email})`);
        continue;
      }

      // Determine boss: prefer explicit bossEmail (searching created admins first, then DB), otherwise fallback to the first admin created
      let bossId = null;
      if (u.bossEmail) {
        if (adminMap.has(u.bossEmail)) {
          bossId = adminMap.get(u.bossEmail)._id;
        } else {
          // try to find boss in DB (maybe pre-existing)
          const bossFromDb = await User.findOne({ email: u.bossEmail });
          if (bossFromDb) {
            bossId = bossFromDb._id;
            adminMap.set(bossFromDb.email, bossFromDb);
          }
        }
      }

      if (!bossId && adminMap.size > 0) {
        bossId = adminMap.values().next().value._id;
      }

      const userData = { ...u, boss: bossId };
      const user = new User(userData);
      await user.save();
      console.log(`User created: ${user.name} (${user.email}) - Roles: ${user.roles.join(', ')} - Boss: ${bossId}`);
    }

    console.log('\nSeeded users (Development only - Do not use in production):');
    for (const admin of adminMap.values()) {
      console.log(`- Admin: ${admin.name} (${admin.email}) - Password: Test@123 - ID: ${admin._id}`);
      // list direct reports for this admin
      const reports = await User.find({ boss: admin._id });
      for (const r of reports) {
        console.log(`  - ${r.roles.join(', ')}: ${r.name} (${r.email}) - Password: Test@123 - Boss: ${admin._id}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
