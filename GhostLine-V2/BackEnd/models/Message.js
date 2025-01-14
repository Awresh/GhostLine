const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String },
  mediaUrl: { type: String },
  isUnsent: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
