const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensures each username is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures each email is unique
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Hash (encrypt) the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;