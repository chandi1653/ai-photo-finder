const fs = require('fs');
const https = require('https');
const path = require('path');

// GitHub par file ka naam 'repo' mein hai, aur AI ko 'local' wala naam chahiye
const models = [
    { repo: 'ssd_mobilenetv1_model-weights_manifest.json', local: 'ssd_mobilenetv1_model-weights_manifest.json' },
    { repo: 'ssd_mobilenetv1_model.weights.bin', local: 'ssd_mobilenetv1_model.bin' },
    { repo: 'face_landmark_68_model-weights_manifest.json', local: 'face_landmark_68_model-weights_manifest.json' },
    { repo: 'face_landmark_68_model.weights.bin', local: 'face_landmark_68_model.bin' },
    { repo: 'face_recognition_model-weights_manifest.json', local: 'face_recognition_model-weights_manifest.json' },
    { repo: 'face_recognition_model.weights.bin', local: 'face_recognition_model.bin' }
];

const baseURL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
const dir = path.join(__dirname, 'ai-models');

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

console.log("⏳ Downloading and Renaming AI Models automatically...");

models.forEach(file => {
    const dest = path.join(dir, file.local);
    https.get(baseURL + file.repo, (res) => {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => { 
            stream.close(); 
            console.log(`✅ Saved as: ${file.local}`); 
        });
    }).on('error', (err) => { 
        console.error(`❌ Error downloading ${file.repo}:`, err.message); 
    });
});