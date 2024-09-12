import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

//Api request: Post tweet.

const createTweet = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body
        if (content === "") {
            throw ApiError(400, "Your field is Empty")
        }

        const tweet = await Tweet.create({
            content,
            owner: req.user._id
        })
        if (!tweet) {
            throw new ApiError(400, "error while creating tweet post")
        }
        return res.status(200)
            .json(
                new ApiResponse(200, tweet, "Your Tweet Posted")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error")
    }
})

//Api request: Retrive a tweet.

const getUserTweets = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params
        if (!tweetId) {
            throw ApiError(404, "User not Found")
        }
        const userTweets = await Tweet.aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                     pipeline: [{
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                     }]
                }
            }
        ])

        return res.status(200)
            .json(
                new ApiResponse(200, userTweets, "All Tweets get")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error")

    }

})

//Api request: Update a tweet.

const updateTweet = asyncHandler(async (req, res) => {
try {
        const {content} = req.body;
        const {tweetId} = req.params;
        if(!tweetId){
            throw new ApiError(404, "Id not Found")
        }
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set:{
                    content
                }
            },
            {new: true}
        )
        return res.status(200)
        .json(
            new ApiResponse(200, updatedTweet, "Your Tweeet Updated successfully" )
        )
} catch (error) {
    throw new ApiError(500, error?.message, "Something went wrong")
    
}
})

//Api request: Delete a tweet.

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    if(!tweetId){
        throw new ApiError(404, "Id not Found")
    }
    const del = await Tweet.findByIdAndDelete(
        tweetId,
    )
    return res.status(200)
    .json(
        new ApiResponse(200, {}, "Your Tweeet deleted successfully" )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}