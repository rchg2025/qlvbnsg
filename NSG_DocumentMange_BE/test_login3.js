const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://Vercel-Admin-atlas-fulvous-notebook:S3BiFzbWXaZTCTns@atlas-fulvous-notebook.cy9ar7d.mongodb.net/NSG_Database?retryWrites=true&w=majority";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const user = await users.findOne({ email: 'rongcon@rongcon.net' });
        if (!user) {
            console.log("User not found!");
            return;
        }

        console.log("User found:", user.email, "Role:", user.role);
        
        const passwordMatch = await bcrypt.compare('123456', user.password);
        console.log("Password match:", passwordMatch);
        
        console.log("Password in DB:", user.password);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
