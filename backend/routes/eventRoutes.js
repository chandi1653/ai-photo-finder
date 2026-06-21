const express = require('express');
require('dotenv').config(); 
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const PhotoTracker = require('../models/PhotoTracker'); 

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
        console.log(`⚡ AI Engine Active in events: ${tf.getBackend()} (Bulk Extract Mode)`);

        await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
            faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
            faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
        ]);
        console.log("🧠 AI Models Loaded Successfully for Events!");
    } catch (err) {
        console.error("AI Setup Error in events:", err);
    }
})();

cloudinary.config({
  cloud_name: 'dxikbpsy1',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// RAM STORAGE (No Cloudinary Blocking)
const upload = multer({ storage: multer.memoryStorage() });

// Custom fast uploader using streams
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'AI_Photo_App_Events' },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        stream.end(buffer); // Instantly streams from RAM
    });
};

router.post('/upload', upload.array('eventPhotos', 50), (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Koi photo nahi mili!' });

    // INSTANT RESPONSE
    res.status(200).json({ message: `Success! ${req.files.length} Photos received. AI is extracting faces in the background...` });

    // BACKGROUND TASK (RAM -> Cloudinary -> AI)
    (async () => {
        try {
            console.log(`\n🚀 [Background Task] Processing & Extracting faces from ${req.files.length} photos...`);

            await Promise.all(req.files.map(async (file) => {
                try {
                    // 1. Upload from RAM to Cloudinary
                    const cloudResult = await uploadToCloudinary(file.buffer);
                    const cloudUrl = cloudResult.secure_url;

                    // 2. Extract faces directly from RAM Buffer
                    const img = await loadImage(file.buffer); 
                    
                    // 🔥 UPDATE: AI ko kam strict kiya (minConfidence 0.4) taaki background faces bhi pakad le
                    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 });
                    const detections = await faceapi.detectAllFaces(img, options).withFaceLandmarks().withFaceDescriptors();

                    // 🔥 Extract face encodings
                    const encodings = detections.map(d => Array.from(d.descriptor));

                    // 3. Save photo AND its face encodings into PhotoTracker
                    await PhotoTracker.create({ 
                        imageUrl: cloudUrl, 
                        publicId: cloudResult.public_id,
                        faceEncodings: encodings 
                    });

                } catch (e) {
                    console.error(`⚠️ Error processing photo:`, e.message);
                }
            }));
            console.log("🎉 [Background Task] All photos uploaded and faces extracted!");
        } catch (bgError) {
            console.error("Background AI Error:", bgError);
        }
    })(); 
});

module.exports = router;