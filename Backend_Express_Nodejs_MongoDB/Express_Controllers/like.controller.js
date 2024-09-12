import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"

//Api request: Check video isliked or not if video not liked else like. through videoId

const toggleVideoLike = asyncHandler(async (req, res) => {
 try {
    const {videoId} = req.params;
    if(!videoId){
    throw new ApiError(404, "Id not found")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "video not found")
    }
    const liked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })
    let isLiked;
    if (liked) {
        isLiked = true
    } else {
        isLiked = false
    }

    return res.status(200)
        .json(
            new ApiResponse(200, { isLiked }, "Video Like")
        )

 } catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong")
 }
})

//Api request: Check comment isliked or not if comment not liked else like. through commentId

const toggleCommentLike = asyncHandler(async (req, res) => {
    try {
        const {commentId} = req.params
        if(!commentId){
            throw new ApiError(404, "Id not found")
            }
            const comment = await Comment.findById(commentId)
            if(!comment){
                throw new ApiError(404, "Comment not found")
            }
            const liked = await Like.findOne({
                comment: commentId,
                likedBy: req.user?._id
            })
            let isLiked;
            if (liked) {
                isLiked = true
            } else {
                isLiked = false
            }
        
            return res.status(200)
                .json(
                    new ApiResponse(200, { isLiked }, "Comment Like")
                )
    } catch (error) {
       throw new ApiError(500, error?.message, "Something went wrong")
    }
})

//Api request: Check tweet isliked or not if tweet not liked else like. through tweetId

const toggleTweetLike = asyncHandler(async (req, res) => {
    try {
        const {tweetId} = req.params
        if(!tweetId){
            throw new ApiError(404, "Id not found")
            }
            const tweet = await Tweet.findById(tweetId)
            if(!tweet){
                throw new ApiError(404, "tweet not found")
            }
            const liked = await Like.findOne({
                tweet: tweetId,
                likedBy: req.user?._id
            })
            let isLiked;
            if (liked) {
                isLiked = true
            } else {
                isLiked = false
            }
        
            return res.status(200)
                .json(
                    new ApiResponse(200, { isLiked }, "Tweet Like")
                )
    } catch (error) {
       throw new ApiError(500, error?.message, "Something went wrong")
    }
}
)

//Api request: Get all liked videos. through userId

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            throw new ApiError(404, "User Id not found");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const userLikedVideos = user.likedVideos;

        if (!userLikedVideos || userLikedVideos.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "User has no liked videos"));
        }

        const videos = await Video.find({
            _id: {
                $in: userLikedVideos
            }
        });

        return res.status(200).json(new ApiResponse(200, videos, "User liked videos fetched successfully"));
    } catch (error) {
        next(new ApiError(500, error.message, "Something went wrong"));
    }
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}