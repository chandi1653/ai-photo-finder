const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const localDbPath = path.join(__dirname, '../guests.json');

// Helper to read local JSON file
function readLocalDb() {
    if (!fs.existsSync(localDbPath)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    } catch (e) {
        return [];
    }
}

// Helper to write local JSON file
function writeLocalDb(data) {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Real Mongoose schema definition
const guestSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    faceEncoding: { type: [Number], required: true }, // AI face descriptor math array
    matchedPhotos: { type: [String], default: [] } // Array of matched photos filenames
}, {
    bufferCommands: false // Disable command buffering to throw immediate errors when offline
});

const MongooseGuestModel = mongoose.model('Guest', guestSchema);

// Wrapper that checks mongoose connection status and falls back to local JSON
class GuestWrapper {
    constructor(data) {
        this.data = data;
        // Generate an ID if not present
        if (!this.data._id) {
            this.data._id = new mongoose.Types.ObjectId().toString();
        }
    }

    async save() {
        try {
            const mgGuest = new MongooseGuestModel(this.data);
            const saved = await mgGuest.save();
            return saved;
        } catch (err) {
            console.log('📝 Saving guest to local JSON fallback database due to error:', err.message);
            const db = readLocalDb();
            if (!this.data.matchedPhotos) {
                this.data.matchedPhotos = [];
            }
            db.push(this.data);
            writeLocalDb(db);
            return this;
        }
    }

    // Proxy properties
    get _id() { return this.data._id; }
    get eventId() { return this.data.eventId; }
    get name() { return this.data.name; }
    get phoneNumber() { return this.data.phoneNumber; }
    get faceEncoding() { return this.data.faceEncoding; }
    get matchedPhotos() { return this.data.matchedPhotos || []; }
}

// Static methods
GuestWrapper.find = async function(query = {}) {
    try {
        const results = await MongooseGuestModel.find(query).maxTimeMS(2000);
        return results;
    } catch (err) {
        console.log('🔍 Querying guests from local JSON fallback database due to Mongoose error:', err.message);
        const db = readLocalDb();
        return db.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });
    }
};

GuestWrapper.findById = async function(id) {
    try {
        const found = await MongooseGuestModel.findById(id).maxTimeMS(2000);
        if (found) return found;
    } catch (err) {
        console.log(`🔍 Finding guest by ID ${id} in local JSON database due to Mongoose error:`, err.message);
    }
    const db = readLocalDb();
    const found = db.find(item => item._id === id.toString());
    return found ? new GuestWrapper(found) : null;
};

GuestWrapper.findByIdAndUpdate = async function(id, update) {
    try {
        const updated = await MongooseGuestModel.findByIdAndUpdate(id, update, { new: true }).maxTimeMS(2000);
        if (updated) return updated;
    } catch (err) {
        console.log(`📝 Updating guest by ID ${id} in local JSON database due to Mongoose error:`, err.message);
    }
    const db = readLocalDb();
    const index = db.findIndex(item => item._id === id.toString());
    if (index !== -1) {
        if (update.$addToSet && update.$addToSet.matchedPhotos) {
            if (!db[index].matchedPhotos) db[index].matchedPhotos = [];
            const photo = update.$addToSet.matchedPhotos;
            if (!db[index].matchedPhotos.includes(photo)) {
                db[index].matchedPhotos.push(photo);
            }
        } else {
            db[index] = { ...db[index], ...update };
        }
        writeLocalDb(db);
        return new GuestWrapper(db[index]);
    }
    return null;
};

module.exports = GuestWrapper;