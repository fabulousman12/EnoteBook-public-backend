const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{

        type:String,
        required:true

    }, username:{

        type:String,
        required:true

    },
    image: {
        data: Buffer,
        contentType: String,
 
    },
    category: {
        type: String,
        required: true
    },
    fileType: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Image', ImageSchema);
