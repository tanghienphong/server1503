const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    }, 
    content: String,
    likes: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    comments: [
        {
            type: Schema.Types.ObjectId, ref:'Comment'
        }
    ]
});
const PostModel = mongoose.model('post', PostSchema);
module.exports = {PostModel}