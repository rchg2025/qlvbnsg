const fs = require('fs');

const transcriptPath = 'C:\\Users\\nvluy\\.gemini\\antigravity\\brain\\c65d9d35-9f70-4191-b6ef-702321059457\\.system_generated\\logs\\transcript_full.jsonl';
const logData = fs.readFileSync(transcriptPath, 'utf8');

const lines = logData.split('\n');
let userContent = '';

for (const line of lines) {
    if (!line.trim()) continue;
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            userContent = obj.content;
            break;
        }
    } catch (e) {
    }
}

fs.writeFileSync('usercontent.txt', userContent);
console.log('Saved to usercontent.txt');
