require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Profile = require('./src/models/Profile');

const ADMIN_EMAIL = 'admin@ku.ac.ke';
const ADMIN_PASSWORD = 'admin123';

async function seedAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = new User({
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD,
      isVerified: true,
    });
    await admin.save();

    // Create admin profile
    await Profile.create({
      userId: admin._id,
      name: 'Admin',
      budgetMin: 0,
      budgetMax: 0,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seedAdmin();
