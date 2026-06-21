// THE ULTIMATE HACK: Library ko tfjs-node chahiye, hum tfjs pakda rahe hain!
require('dotenv').config();
require('module-alias/register'); 
// Debugging code
console.log("--- DEBUG START ---");
console.log("Current Working Directory (CWD):", process.cwd());
const fs = require('fs');
const path = require('path');
const nodeModulesPath = path.join(process.cwd(), 'backend', 'node_modules', 'node-cron');
console.log("Checking if node-cron exists at:", nodeModulesPath);
console.log("Does path exist?", fs.existsSync(nodeModulesPath));
console.log("--- DEBUG END ---");

// Ab tumhare baaki imports
require('dotenv').config();
require('module-alias/register');
const cron = require('node-cron'); 
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);// Ye line sabse upar honi chahiye
const moduleAlias = require('module-alias');
moduleAlias.addAlias('@tensorflow/tfjs-node', '@tensorflow/tfjs');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');
require('dotenv').config();

// Canvas and AI face-api Global Setup
const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('@vladmandic/face-api/dist/face-api.node.js');

// Node.js environment patch
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const modelsPath = path.join(__dirname, 'node_modules/@vladmandic/face-api/model');
console.log('🧠 Loading AI Models globally...');
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
])
.then(() => console.log('🧠 AI Models loaded successfully!'))
.catch(err => console.error("❌ Model loading error:", err));

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Uploads folder ko frontend ke liye open kar diya hai
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const guestRoutes = require('./routes/guestRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/guests', guestRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.send('AI Photo App Backend is running!'));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-photo-app';

// Database connection (Non-blocking with a 5-second timeout)
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(MONGO_URI, {
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000 
})
.then(async () => {
    console.log('✅ Connected to MongoDB');
    // Auto-migrate guests.json database to MongoDB Atlas if it exists
    try {
        const localDbPath = path.join(__dirname, 'guests.json');
        if (fs.existsSync(localDbPath)) {
            console.log('🔄 Local JSON database found. Migrating local guests to MongoDB Atlas...');
            const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
            if (localData.length > 0) {
                const MongooseGuestModel = mongoose.model('Guest');
                let migratedCount = 0;
                for (const item of localData) {
                    const exists = await MongooseGuestModel.findById(item._id);
                    if (!exists) {
                        const newGuest = new MongooseGuestModel(item);
                        await newGuest.save();
                        migratedCount++;
                    }
                }
                console.log(`✅ Migrated ${migratedCount} guests to MongoDB Atlas successfully!`);
            }
            fs.unlinkSync(localDbPath);
            console.log('🗑️ Local fallback database guests.json removed.');
        }
    } catch (migrateErr) {
        console.error('⚠️ Data migration warning:', migrateErr.message);
    }
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running backend server with local JSON fallback database.');
});
const cron = require('node-cron')
const cloudinary = require('cloudinary').v2;
const PhotoTracker = require('./models/PhotoTracker');
const Guest = require('./models/Guest');

// ==========================================
// 💣 THE DESTRUCTOR (Runs Every 1 Hour)
// ==========================================
// Ye function har ghante chalega aur check karega
cron.schedule('0 * * * *', async () => {
    console.log("🧹 Running 24-Hour Destructor Scan...");
    try {
        // 24 ghante purana time nikalo
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        // Wo photos dhundo jo 24 ghante se pehle upload hui thi
        const expiredPhotos = await PhotoTracker.find({ uploadedAt: { $lt: twentyFourHoursAgo } });

        if (expiredPhotos.length === 0) {
            console.log("✅ No expired bulk photos found right now.");
            return;
        }

        for (const photo of expiredPhotos) {
            // 1. Cloudinary ke server se photo hamesha ke liye Delete karo
            await cloudinary.uploader.destroy(photo.publicId);

            // 2. Guest ke account se us photo ka link hata do
            await Guest.updateMany(
                {},
                { $pull: { matchedPhotos: photo.imageUrl } }
            );

            // 3. Tracker se list clear kar do
            await PhotoTracker.findByIdAndDelete(photo._id);
            
            console.log(`🗑️ Deleted expired photo from Cloudinary & DB: ${photo.publicId}`);
        }
        
        console.log(`🎉 Destructor finished! Cleaned ${expiredPhotos.length} photos.`);
    } catch (err) {
        console.error("❌ Destructor Error:", err);
    }
});
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on http://0.0.0.0:${PORT}`));