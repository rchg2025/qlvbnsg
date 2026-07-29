const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://Vercel-Admin-atlas-fulvous-notebook:S3BiFzbWXaZTCTns@atlas-fulvous-notebook.cy9ar7d.mongodb.net/NSG_Database?retryWrites=true&w=majority";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const email = 'rongcon@rongcon.net';
        const newPassword = '123456';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await users.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log(`Successfully reset password for ${email}`);
        } else {
            console.log(`User ${email} not found`);
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
