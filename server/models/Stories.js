import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    userId:{
        type: String
    },
    username: {
        type: String
    },
    userPic:{
        type: String
    },
    fileType: {
        type: String
    },
    file: {
        type: String
    },
    text:{
        type: String
    },
    viewers: {
        type: Array
    }

}, {timestamps: true});

const Stories = mongoose.model('stories', storySchema);
export default Stories;