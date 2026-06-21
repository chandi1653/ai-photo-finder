const express = require('express');
const multer = require('multer');
const router = express.Router();
const PhotoTracker = require('../models/PhotoTracker'); // 👈 Guest hata diya

// 🔥 NAYA AI ENGINE: WASM (WebAssembly)
const tf = require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-wasm');
const faceapi = require('@vladmandic/face-api/dist/face-api.node.js'); 

// Patch Node.js environment
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const path = require('path');
const modelsPath = path.join(__dirname, '../node_modules/@vladmandic/face-api/model');

// 🔥 SUPER HACK: WASM ENGINE KO START KARNA AUR MODELS LOAD KARNA
(async () => {
    try {
        await tf.setBackend('wasm');
        await tf.ready();
        console.log(`⚡ AI Engine Active in guests: ${tf.getBackend()} (Ultra Fast Search Mode)`);

        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
            faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
            faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
        ]);
        console.log("🧠 AI Models Loaded Successfully for Guests!");
    } catch (err) {
        console.error("AI Setup Error in guests:", err);
    }
})();

const upload = multer({ storage: multer.memoryStorage() });

// 🔥 RAM CACHE FOR ULTRA FAST SEARCH
let photosCache = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache

const getPhotosFromCache = async () => {
    if (photosCache && (Date.now() - lastCacheUpdate < CACHE_TTL)) {
        return photosCache; // Return instantly from RAM
    }
    console.log("🔄 Loading all gallery photos into RAM for instant search...");
    // Sirf wahi photos lao jisme kam se kam 1 chehra ho
    photosCache = await PhotoTracker.find({ faceEncodings: { $exists: true, $not: { $size: 0 } } });
    lastCacheUpdate = Date.now();
    return photosCache;
};

const processBuffer = (req) => {
    if (req.file) return req.file.buffer;
    if (req.body.selfie) return Buffer.from(req.body.selfie.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    return null;
};

router.post('/find-photos', upload.single('selfie'), async (req, res) => {
    try {
        const buffer = processBuffer(req);
        if (!buffer) return res.status(400).json({ message: 'Selfie upload nahi hui!' });

        // Load image directly from RAM buffer
        const img = await loadImage(buffer);
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detection) return res.status(400).json({ message: 'Chehra saaf nahi dikha.' });

        const targetDescriptor = detection.descriptor; // Selfie ka AI data
        const allPhotos = await getPhotosFromCache(); // RAM se saari gallery nikalo
        const matchedUrls = [];

        // 🔥 ULTRA-FAST MATCHING LOOP (Pure Mathematics)
        for (const photo of allPhotos) {
            for (const encoding of photo.faceEncodings) {
                const dbDescriptor = new Float32Array(encoding);
                const distance = faceapi.euclideanDistance(targetDescriptor, dbDescriptor);
                
                // 0.48 Strictness level
                if (distance < 0.54) { 
                    matchedUrls.push(photo.imageUrl);
                    break; // Ek photo me match mil gaya toh usi photo ke dusre chehre check mat karo
                }
            }
        }

        // Agar cache invalid/empty ho toh refresh karne ke liye
        if (matchedUrls.length === 0) {
            photosCache = null; 
        }

        res.status(200).json({ 
            message: matchedUrls.length > 0 ? `✨ Found ${matchedUrls.length} photos instantly!` : 'Oops, koi photo nahi mili.', 
            name: "Guest", 
            photos: matchedUrls 
        });

    } catch (error) {
        console.error("Selfie Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;