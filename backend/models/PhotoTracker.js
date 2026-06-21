const mongoose = require('mongoose');

const PhotoTrackerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    // 🔥 Yahan saare chehron ka AI data save hoga
    faceEncodings: { type: [[Number]], default: [] }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PhotoTracker', PhotoTrackerSchema);