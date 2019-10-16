const mongoose = require('mongoose'),
    Scehma = mongoose.Schema;


const convesaionSchema = mongoose.Schema({
    members: [{
        type: Scehma.Types.ObjectId,
        ref: 'User'
    }]
})

const Conversation = mongoose.model('Conversation', convesaionSchema);

module.exports = {Conversation}