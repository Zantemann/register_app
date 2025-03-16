import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  registerStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  guests: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  allergies: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'Users');

export default User;
