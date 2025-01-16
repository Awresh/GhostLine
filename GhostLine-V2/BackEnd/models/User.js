const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  interests: { type: [String], default: [] },
  friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  allowFriendRequests: { type: Boolean, default: true },
  allowMediaSharing: { type: Boolean, default: true },
  allowVoiceNotes: { type: Boolean, default: true },
  socketId: { type: String },
  location: {
    type:"point",
    coordinates:[longitude, latitude]
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
