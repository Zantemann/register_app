import mongoose, { Schema } from 'mongoose';

const sessionSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // Document will be automatically deleted when expiresAt is reached
  },
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema, 'Sessions');

export default Session;
