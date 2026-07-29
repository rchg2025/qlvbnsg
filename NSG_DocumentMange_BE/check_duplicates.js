const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Vercel-Admin-atlas-fulvous-notebook:S3BiFzbWXaZTCTns@atlas-fulvous-notebook.cy9ar7d.mongodb.net/NSG_Database?retryWrites=true&w=majority";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const userList = await users.find({ email: 'rongcon@rongcon.net' }).toArray();
        console.log(`Found ${userList.length} users with email rongcon@rongcon.net`);
        userList.forEach(u => {
            console.log(u._id, u.email, u.password);
        });

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
