const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://Vercel-Admin-atlas-fulvous-notebook:S3BiFzbWXaZTCTns@atlas-fulvous-notebook.cy9ar7d.mongodb.net/NSG_Database?retryWrites=true&w=majority';
async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  // 1. Get old positions from JSON
  const oldPosJson = JSON.parse(fs.readFileSync('C:/Users/nvluy/Studio/Du an Nodejs/qlvb/Database/NSG_Database.positions.json'));
  const oldPosMap = {};
  for (const p of oldPosJson) {
    if (p._id && p._id['$oid']) {
      oldPosMap[p.positionCode] = p._id['$oid'];
    }
  }

  // 2. Get current positions from DB
  const currPositions = await db.collection('positions').find().toArray();
  const newPosMap = {};
  for (const p of currPositions) {
    newPosMap[p.positionCode] = p._id.toString();
  }

  // 3. Update users
  let updatedCount = 0;
  for (const code of Object.keys(oldPosMap)) {
    const oldId = oldPosMap[code];
    const newId = newPosMap[code];
    if (oldId && newId && oldId !== newId) {
      console.log(`Updating users with position code ${code}: ${oldId} -> ${newId}`);
      const res = await db.collection('users').updateMany(
        { position: new ObjectId(oldId) },
        { $set: { position: new ObjectId(newId) } }
      );
      updatedCount += res.modifiedCount;
    }
  }
  console.log('Total users updated:', updatedCount);

  await client.close();
}
run();
