const fs = require('fs');

const transcriptPath = 'C:\\Users\\nvluy\\.gemini\\antigravity\\brain\\c65d9d35-9f70-4191-b6ef-702321059457\\.system_generated\\logs\\transcript_full.jsonl';
const logData = fs.readFileSync(transcriptPath, 'utf8');

const lines = logData.split('\n');
let userInput = null;

for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim()) {
        const entry = JSON.parse(lines[i]);
        if (entry.type === 'USER_INPUT') {
            userInput = entry.content;
            break;
        }
    }
}

if (!userInput) {
    console.log('User input not found.');
    process.exit(1);
}

const arrays = [];
let currentIndex = 0;

while (true) {
    const startIndex = userInput.indexOf('[{', currentIndex);
    if (startIndex === -1) break;

    let bracketsCount = 0;
    let inString = false;
    let escape = false;
    let endIndex = -1;

    for (let i = startIndex; i < userInput.length; i++) {
        const char = userInput[i];

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
        arrays.push(userInput.substring(startIndex, endIndex + 1));
        currentIndex = endIndex + 1;
    } else {
        break;
    }
}

console.log(`Found ${arrays.length} arrays.`);

const fileNames = ['units.json', 'replieddocs.json', 'users.json', 'departments.json', 'docvariants.json'];

arrays.forEach((arr, index) => {
    if (index < fileNames.length) {
        fs.writeFileSync(fileNames[index], arr);
        console.log(`Saved ${fileNames[index]}`);
    }
});
