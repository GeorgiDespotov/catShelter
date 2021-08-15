const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    adoptedCats: [{ type: Schema.Types.ObjectId, ref: 'Cat', default: [] }]
});

module.exports = model('User', schema);