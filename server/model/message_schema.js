const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const messageSchema = mongoose.Schema({
    conversatioId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})


const Message = mongoose.model('Message', messageSchema)

module.exports = {Message}