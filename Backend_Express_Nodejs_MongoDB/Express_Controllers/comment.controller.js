import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"

//Api request: post a comment of video. through commentId

const addComment = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body
        const { videoId } = req.params
        if(!videoId){
            throw ApiError(400, "Id did`t match")
        }
        const comment = await Comment.create({
            content,
        })
        comment.owner = req.user?._id;
        comment.video = videoId
        comment.save();
        return res.status(200)
            .json(
                new ApiResponse(200, comment, "Comment post Successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.messege, "Error in Comment post")
    }
});

//Api request: get a comment of video. through commentId

const getVideoComments = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const comment = await Comment.findById(commentId)
        if(!comment){
            throw ApiError(400, "not found")
        }
        return res.status(200)
            .json(new ApiResponse(
                200,
                comment,
                "Comment Get Successfully"
            ));
         
    } catch (error) {
        throw new ApiError(500, error?.messege, "Error in Comment Fetched from Server")
    }

});

//Api request: update a comment of video. through commentId

const updateComment = asyncHandler(async (req, res) => {
    try {
      const { content } = req.body
      const { commentId } = req.params
      const comment = await Comment.findByIdAndUpdate(
           commentId,
          {
              $set: {
                  content: content
              }
          },
          { new: true },
      )
      return res.status(200)
      .json(
          new ApiResponse(200, comment, "Comment Updated Successfully")
      )
  } catch (error) {
    throw new ApiError(500, error?.messege, "Server Error")
  }
});

//Api request: delete a comment of video. through commentId

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const {commentId} = req.params
        const comment = await Comment.findByIdAndDelete(commentId)
        return res.status(200)
        .json(
            new ApiResponse(200, comment, "Comment Deleted Successfully")
        )
    } catch (error) {
    throw new ApiError(500, error?.messege, "Server Error")
    }
});

//Api request: get all comments of video. through videoId

const getVideoAllComments = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findById(videoId).populate('comments');
        if(!video){
            throw ApiError(400, "Video not Found")
        }
        const comments = video.comments;
        return res.status(200)
            .json(new ApiResponse(
                200,
                comments,
                "Comment Get Successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.messege, "Error in Comment Fetched from Server")
    }

});

// named exports of all routes

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
    getVideoAllComments
}