require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/document.model');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const docs = await Document.find({ shortDescription: { $regex: 'lái xe', $options: 'i' } });
    console.log('Found documents:', docs.length);
    docs.forEach(d => console.log(d.docNum + '/' + d.docCode + ' - ' + d.shortDescription));
    process.exit(0);
  }).catch(err => { console.error(err); process.exit(1); });
