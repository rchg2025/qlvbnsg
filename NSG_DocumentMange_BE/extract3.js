const fs = require('fs');

const transcriptPath = 'C:\\Users\\nvluy\\.gemini\\antigravity\\brain\\c65d9d35-9f70-4191-b6ef-702321059457\\.system_generated\\logs\\transcript_full.jsonl';
const logData = fs.readFileSync(transcriptPath, 'utf8');

const regex = /\[\{\n  "_id"/g;
let match;
const arrays = [];

while ((match = regex.exec(logData)) !== null) {
    const startIndex = match.index;
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
        arrays.push(logData.substring(startIndex, endIndex + 1));
        regex.lastIndex = endIndex + 1; // Move past this array
    }
}

console.log(`Found ${arrays.length} arrays.`);

// We expect 5 arrays based on the prompt
const targetArrays = arrays.slice(-5);
const fileNames = ['units.json', 'replieddocs.json', 'users.json', 'departments.json', 'docvariants.json'];

targetArrays.forEach((arr, index) => {
    fs.writeFileSync(fileNames[index], arr);
    console.log(`Saved ${fileNames[index]} with ${arr.length} chars`);
});
