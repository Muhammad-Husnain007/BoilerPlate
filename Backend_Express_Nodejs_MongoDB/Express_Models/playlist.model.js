import mongoose, { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    video: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    description: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    owner: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

}, { timestamps: true })


export const Playlist = model('Playlist', playlistSchema);