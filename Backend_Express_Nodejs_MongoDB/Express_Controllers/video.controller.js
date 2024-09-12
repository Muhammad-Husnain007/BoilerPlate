import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { fileUploadCloudinary, deleteFileFromCloudinary } from "../utils/Fileupload.js"

//Api request: Retrive all videos.

const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const video = await Video.find(req.video)
        return res.status(200)
            .json(
                new ApiResponse(200, video, "Videos Get Successfully"
                ))
    } catch (error) {
        throw new ApiError(500, error?.message, "Error ig Get Videos")
    }
});

//Api request: Publish a video.

const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body
    if (
        [title, description].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const uplodVideoPath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path
    if (!uplodVideoPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailPath) {
        throw new ApiError(400, "Video thumbnail file is required")
    }
    const videoFile = await fileUploadCloudinary(uplodVideoPath)
    const videoThumbnail = await fileUploadCloudinary(thumbnailPath)
    if (!videoFile) {
        throw new ApiError(400, "Video is required for cloud")
    }
    if (!videoThumbnail) {
        throw new ApiError(400, "Video is required for cloud")
    }
    console.log(videoFile)
    const publishVideo = await Video.create({
        title,
        description,
        thumbnail: videoThumbnail.url,
        duration: videoFile.duration,
        videoFile: videoFile.url
    })
    publishVideo.owner = req.user?._id;
    publishVideo.save();

    console.log(publishVideo);

    return res.status(200).json(
        new ApiResponse(200, publishVideo, "Video Upload Successfully")
    )

});

//Api request: Retrive a video by id.

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(400, "Video not Found")
        }
        return res.status(200)
            .json(
                new ApiResponse(200, video, "Video getById Successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Something went wrong")
    }
});

//Api request: Update a video.

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const existingVideo = await Video.findById(videoId);
        if (!existingVideo) {
            throw new ApiError(404, 'Video not found');
        }
        const { title, description } = req.body
        const video = req.files?.videoFile[0]?.path
        const thumbnail = req.files?.thumbnail[0]?.path

        const updateVideo = await fileUploadCloudinary(video)
        const updatethmbnail = await fileUploadCloudinary(thumbnail)

        if (!updateVideo.url) {
            throw new ApiError(400, "Error while updating video")
        }
        if (!updatethmbnail.url) {
            throw new ApiError(400, "Error while updating thumbnail")
        }

        const videoUpdated = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    videoFile: updateVideo.url,
                    thumbnail: updatethmbnail.url,
                }
            },
            { new: true }
        )
        
        if (updatethmbnail && existingVideo.thumbnail) {
            await deleteFileFromCloudinary(existingVideo.thumbnail);
        }
        if (updateVideo && existingVideo.videoFile) {
            await deleteFileFromCloudinary(existingVideo.videoFile);
        }

        return res.status(200)
            .json(
                new ApiResponse(200, videoUpdated, "Video Update Successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Something went wrong while update video file")
    }

});

//Api request: Delete a video.

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findByIdAndDelete(videoId)
        return res.status(200)
            .json(
                new ApiResponse(200, video, "Video Deleted Successfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Error While Deleting video")
    }
});

//Api request: Checked video status uploaded or not.

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Video not Found in toogle")
    }
    video.isPublish = !video.isPublish
    await video.save()

    return res.status(200)
    .json(
        new ApiResponse(200, video, "Video toogle Updated successfully")
    )
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}