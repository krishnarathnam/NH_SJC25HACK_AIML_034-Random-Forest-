// Run this script once to drop old indexes: node drop-old-indexes.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sortit';

async function dropOldIndexes() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop old studentId index from sessions
    try {
      await db.collection('sessions').dropIndex('studentId_1_contextId_1');
      console.log('✅ Dropped old studentId_1_contextId_1 index from sessions');
    } catch (e) {
      if (e.code === 27) {
        console.log('ℹ️  studentId_1_contextId_1 index does not exist (already removed)');
      } else {
        console.log('⚠️  Could not drop studentId_1_contextId_1:', e.message);
      }
    }

    // Drop old studentId index from progresses
    try {
      await db.collection('progresses').dropIndex('studentId_1_algorithm_1');
      console.log('✅ Dropped old studentId_1_algorithm_1 index from progresses');
    } catch (e) {
      if (e.code === 27) {
        console.log('ℹ️  studentId_1_algorithm_1 index does not exist (already removed)');
      } else {
        console.log('⚠️  Could not drop studentId_1_algorithm_1:', e.message);
      }
    }

    // List current indexes to verify
    console.log('\n📋 Current indexes on sessions collection:');
    const sessionIndexes = await db.collection('sessions').indexes();
    sessionIndexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)} (${idx.name})`);
    });

    console.log('\n📋 Current indexes on progresses collection:');
    const progressIndexes = await db.collection('progresses').indexes();
    progressIndexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)} (${idx.name})`);
    });

    console.log('\n✅ Migration complete! You can now restart the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure your MONGO_URI is set correctly in .env file');
    process.exit(1);
  }
}

dropOldIndexes();

