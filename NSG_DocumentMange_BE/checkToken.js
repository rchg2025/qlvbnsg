const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/user.model');
mongoose.connect(process.env.MONGODB_URI).then(() => {
    return User.findOne({ 'google.refreshToken': { $exists: true, $ne: null } });
}).then(u => {
    console.log(u ? 'Found user with refresh token: ' + u.email : 'No user found');
    process.exit(0);
}).catch(console.error);
