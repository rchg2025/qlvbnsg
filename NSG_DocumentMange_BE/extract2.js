const fs = require('fs');

const transcriptPath = 'C:\\Users\\nvluy\\.gemini\\antigravity\\brain\\c65d9d35-9f70-4191-b6ef-702321059457\\.system_generated\\logs\\transcript_full.jsonl';
const logData = fs.readFileSync(transcriptPath, 'utf8');

const arrays = [];
let currentIndex = 0;

while (true) {
    const startIndex = logData.indexOf('[\n{\n  "_id": {\n    "$oid"', currentIndex);
    if (startIndex === -1) {
        const altStartIndex = logData.indexOf('[{', currentIndex);
        if (altStartIndex === -1) break;
        currentIndex = altStartIndex + 1;
        // Check if it's large enough to be one of our arrays
        continue;
    }

    let bracketsCount = 0;
    let inString = false;
    let escape = false;
    let endIndex = -1;

    for (let i = startIndex; i < logData.length; i++) {
        const char = logData[i];

        if (escape) {
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (!inString) {
            if (char === '[') bracketsCount++;
            else if (char === ']') {
                bracketsCount--;
                if (bracketsCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
    }

    if (endIndex !== -1) {
        const arrStr = logData.substring(startIndex, endIndex + 1);
        // Clean up escaped characters if this was within a JSON string
        let cleaned = arrStr;
        try {
            // Check if it parses
            JSON.parse(cleaned);
            arrays.push(cleaned);
        } catch (e) {
            try {
                cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                JSON.parse(cleaned);
                arrays.push(cleaned);
            } catch (e2) {}
        }
        currentIndex = endIndex + 1;
    } else {
        break;
    }
}

console.log(`Found ${arrays.length} arrays.`);

// The arrays we want are the last 5
if (arrays.length >= 5) {
    const targetArrays = arrays.slice(-5);
    const fileNames = ['units.json', 'replieddocs.json', 'users.json', 'departments.json', 'docvariants.json'];

    targetArrays.forEach((arr, index) => {
        fs.writeFileSync(fileNames[index], arr);
        console.log(`Saved ${fileNames[index]}`);
    });
}
