import mongoose from "mongoose";

const commentSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    
},{timestamps: true})


export const Comment = mongoose.model("Comment",commentSchema)