import mongoose from "mongoose";

const postSchema  = mongoose.Schema({
    userId: {
        type: String
    },
    userName:{
        type: String
    },
    userPic:{
        type: String
    },
    fileType: {
        type: String
    },
    file : {
        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    likes: {
        type: Array
    },
    comments: {
        type: Array
    }
}, {timestamps: true});

const Post = mongoose.model("posts", postSchema);
export default Post;