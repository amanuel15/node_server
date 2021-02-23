const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
})



const postSchema = new mongoose.Schema({
    imageUrl:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    caption:{
        type:String,
        required:true,
        min: 20,
        max:256
    },
    likes:{
        type:[mongoose.Types.ObjectId]
    },
    comments :{
        type:[commentSchema]
    }
})




const Post = mongoose.model('Post',postSchema);
const Comment = mongoose.model('Comment',commentSchema);
module.exports = {Post,Comment};