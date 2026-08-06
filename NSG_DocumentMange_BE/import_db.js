const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://Vercel-Admin-atlas-fulvous-notebook:S3BiFzbWXaZTCTns@atlas-fulvous-notebook.cy9ar7d.mongodb.net/NSG_Database?retryWrites=true&w=majority";
const uploadDir = 'C:\\Users\\nvluy\\Studio\\Du an Nodejs\\qlvb\\Database';

function transformDocument(doc) {
    if (doc === null || typeof doc !== 'object') {
        return doc;
    }
    
    if (Array.isArray(doc)) {
        return doc.map(transformDocument);
    }
    
    if (doc.$oid) {
        return new ObjectId(doc.$oid);
    }
    
    if (doc.$date) {
        return new Date(doc.$date);
    }
    
    const transformed = {};
    for (const [key, value] of Object.entries(doc)) {
        transformed[key] = transformDocument(value);
    }
    
    return transformed;
}

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        
        const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const content = fs.readFileSync(path.join(uploadDir, file), 'utf8');
            let data;
            try {
                data = JSON.parse(content);
            } catch (e) {
                console.error(`Failed to parse ${file}`);
                continue;
            }
            
            if (!Array.isArray(data)) {
                console.error(`${file} is not an array`);
                continue;
            }

            const transformedData = data.map(transformDocument);
            
            let collectionName = file.split('.')[1];
            if (!collectionName) {
                console.log(`Unknown collection for file ${file}`);
                continue;
            }
            let uniqueField = '_id';
            
            console.log(`Inserting/Updating ${transformedData.length} records into ${collectionName} from ${file} using ${uniqueField}`);
            
            const collection = db.collection(collectionName);
            for (const doc of transformedData) {
                try {
                    let filter = { _id: doc._id };
                    // We can also try by unique field
                    if (uniqueField !== '_id') {
                        filter = { [uniqueField]: doc[uniqueField] };
                    }
                    
                    const docWithoutId = { ...doc };
                    delete docWithoutId._id;
                    
                    await collection.updateOne(
                        filter,
                        { $set: docWithoutId, $setOnInsert: { _id: doc._id } },
                        { upsert: true }
                    );
                } catch (e) {
                    console.error(`Error on doc ${doc._id}: ${e.message}`);
                }
            }
            console.log(`Finished ${file}`);
        }
        console.log("All done!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();
