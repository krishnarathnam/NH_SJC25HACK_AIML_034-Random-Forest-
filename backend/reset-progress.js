const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sortit';

async function resetProgress() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Reset all Selection Sort progress to fix milestone order
    const result = await db.collection('progresses').updateMany(
      { algorithm: 'Selection Sort' },
      {
        $set: {
          'milestones.$[].status': 'pending',
          'milestones.$[].completedAt': null,
          'milestones.$[].xpAwarded': 0,
          'isCompleted': false,
          'totalXpFromMilestones': 0
        }
      }
    );

    console.log(`✅ Reset ${result.modifiedCount} Selection Sort progress documents`);
    console.log('💡 All milestones set to pending. Users can start fresh with correct order.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetProgress();

