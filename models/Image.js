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
    },
    username: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
       
     
        data: Buffer,
        contentType: String,
        fileType: String,
       
        createdAt: {
            type: Date,
            default: Date.now
        },
      
    }]
});

module.exports = mongoose.model('Image', ImageSchema);
