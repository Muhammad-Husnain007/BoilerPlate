import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"

//Api request: Create a playlist.

const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        if (
            [name, description].some((fields) => fields?.trim() === "")
        ) {
            throw new ApiError(400, "please fullfilled all fields")
        }
        const checkPlaylist = await Playlist.findOne({
            $or: [{ name, description }]
        })
        if (checkPlaylist) {
            throw new ApiError(400, "This play list is alredy exist")
        }
        const newPlaylist = await Playlist.create({
            name,
            description,
            owner: req.user._id,
        });

        await newPlaylist.save();

        return res.status(200).json(
            new ApiResponse(200, newPlaylist, "Playlist Create Successfully")
        )

    } catch (error) {
        throw new ApiError(500, error?.message, "Some thing went wrong")

    }
});

//Api request: Add videos into playlist.

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;
        if (!playlistId) {
            throw new ApiError(404, "Id not Match")
        }
        if (!videoId) {
            throw new ApiError(404, "Video not Found")
        }
        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "This playlist not Found")
        }
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(404, "This Video not Found")
        }
        //  const user = req.user._id
        //  const owner = await Playlist.find({owner : user})
        //  if (owner !== user) {
        //     throw new ApiError(403, "You are not authorized to add videos to this playlist");
        // }
        playlist.video.push(video._id)
        await playlist.save()
        return res.status(200)
            .json(
                new ApiResponse(200, playlist, "Video add into playlist Successfully")
            )

    } catch (error) {
        throw new ApiError(500, error?.message, "Somethin went wrong")

    }

});

//Api request: get playlist. through userId

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            throw new ApiError(400, "User Id not match")
        }
        const playlist = await Playlist.find({ owner: userId })
        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        return res.status(200)
            .json(
                new ApiResponse(200, playlist, "All Playlist fetched Succesfully")
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Something went wrong")

    }

});

//Api request: get playlist by playlist Id.


const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        if (!playlistId) {
            throw new ApiError(400, "Playlist ID is required"); // 400 Bad Request for missing ID
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }

        return res.status(200).json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error?.message, "Some thing went wrong")
    }
});

//Api request: remove video from playlist.

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params
        if (!playlistId || !videoId) {
            throw new ApiError(404, "Playlist or Video Id not match");
        }
        const playlist = await Playlist.findById(playlistId)
        const video = await Playlist.findOne({video : videoId})
        if (!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
        playlist.video = playlist.video.filter(item => item != videoId)
        await playlist.save()

        return res.status(200).json(
            new ApiResponse(200, playlist, "Video removed from Playlist")
        )
    } catch (error) {
        throw new ApiError(500, error?.message, "Some thing went wrong")
    }
});

//Api request: delete playlist.

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
      const { playlistId } = req.params
      if(!playlistId){
          throw new ApiError(404, "Playlist Id not match");
      }
      const playlist = await Playlist.findByIdAndDelete(playlistId)
      if (!playlist) {
          throw new ApiError(404, "Playlist not found")
      }
      return res.status(200).json(
          new ApiResponse(200, playlist, "Playlist deleted from Playlist")
      )
  } catch (error) {
    throw new ApiError(500, error?.message, "Some thing went wrong")
    
  }

})

//Api request: update playlist.

const updatePlaylist = asyncHandler(async (req, res) => {
   try {
     const { playlistId } = req.params
     const { name, description } = req.body
     if(!playlistId){
        throw new ApiError(404, "Playlist Id not match");
    }
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description,
            }
        },
        {new: true}
    
    )
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist deleted Successfully")
    )
} catch (error) {
  throw new ApiError(500, error?.message, "Some thing went wrong")
  
}
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}