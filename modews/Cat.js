const { Schema, model } = require('mongoose');


const catSchema = new Schema({
    name: { type: String },
    bread: { type: String },
    description: { type: String },
    age: { type: Number },
    imageUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Cat', catSchema);