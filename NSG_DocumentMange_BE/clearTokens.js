const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/user.model');
mongoose.connect(process.env.MONGODB_URI).then(() => {
    return User.updateMany(
        { 'google.refreshToken': { $ne: null } },
        { $unset: { 'google.refreshToken': 1, 'google.accessToken': 1, 'google.tokenExpiryDate': 1 } }
    );
}).then(res => {
    console.log('Cleared tokens for', res.modifiedCount, 'users');
    process.exit(0);
}).catch(console.error);
