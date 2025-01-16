const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  mediaUrl: { type: String },
  isUnsent: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
