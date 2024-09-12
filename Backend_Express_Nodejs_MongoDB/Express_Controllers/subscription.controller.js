import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

//Api request: Subscribed a channel.

const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params
        const subscription = await Subscription.findOne(
            {
                channel: channelId,
                subscriber: req.user?._id
            }
        )
        if (!subscription) {
            await Subscription.create({
                channel: channelId,
                subscriber: req.user?._id,

            })
        } else {
            await Subscription.findByIdAndDelete(subscription._id)
        }
        const subscribed = await Subscription.findOne({
            channel: channelId,
            subscriber: req.user?._id
        })
        let isSubscribed;
        if (subscribed) {
            isSubscribed = true
        } else {
            isSubscribed = false
        }

        return res.status(200)
            .json(
                new ApiResponse(200, { isSubscribed }, "Channel Subscribed")
            )
    } catch (error) {
        throw ApiError(500, error?.message, "Server Error")
    }
})

//Api request: get subscribers of channel.

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
   try {
     const { channelId } = req.params
     if (!channelId) {
         throw ApiError(400, "Channel Not found")
     }
     const subscriber = await Subscription.aggregate(
         [
             {
                 $match: {
                     channel: new mongoose.Types.ObjectId(`${channelId}`)
                 }
             },
             {
                 $lookup: {
                     from: "users",
                     localField: "subscribers",
                     foreignField: "_id",
                     as: "subscribers",
                     pipeline: [
                         {
                             $project: {
                                 username: 1,
                                 fullName: 1,
                                 avatar: 1
                             }
                         }
                     ]
                 }
             },
             {
                 $project: {
                     subscriber: 1,
                     createdAt: 1
                 }
             }
 
         ]
     )
     return res.status(200)
     .json(
         new ApiResponse(200, subscriber, "Subscribers list get Successfully")
     )
   } catch (error) {
    throw ApiError(500, error?.message, "Server Error")
    
   }

})

// //Api request: get those chennels ehose subscribed.

const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            throw new ApiError(400, "Subscriber ID not found");
        }

        const channels = await Subscription.aggregate([
            {
                $match: { subscriber: new mongoose.Types.ObjectId(`${channelId}`) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channel",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    channel: 1,
                    createdAt: 1
                }
            }
        ])

        return res.status(200).json(
            new ApiResponse(200, channels, "Subscribed channels fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error");
    }
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}