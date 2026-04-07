require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
console.log('🔍 Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000
});

async function test() {
  try {
    console.log('🔄 Connecting...');
    await client.connect();
    console.log('✅ Connected!');
    
    const db = client.db('roomiez');
    await db.command({ ping: 1 });
    console.log('✅ Ping successful - MongoDB Atlas is working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 DNS issue - check your internet connection');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Wrong username or password in Database Access');
    } else if (error.message.includes('whitelist')) {
      console.log('💡 IP not whitelisted in Network Access');
    } else if (error.message.includes('cluster')) {
      console.log('💡 Cluster may be paused - check Atlas dashboard');
    }
  } finally {
    await client.close();
  }
}

test();
