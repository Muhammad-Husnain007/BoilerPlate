import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import {fileUploadCloudinary, deleteFileFromCloudinary} from "../utils/Fileupload.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//Api request: Generate both access and refresh token.

const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Some thing went wrong");
    };
};

//Api request: Create a rser.

const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, password } = req.body
    if (
        [username, fullName, email, password].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const checkUserIsAlredyExist = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (checkUserIsAlredyExist) {
        throw new ApiError(409, "This email or username already exists")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await fileUploadCloudinary(avatarLocalPath);
    const coverImage = await fileUploadCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required for cloud")
    }

    const newUser = await User.create({
        fullName,
        password,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong")
    }
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

});

//Api request: Login user.

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email && !password) {
        throw new ApiError(400, "Please enter email and password");
    }
    const user = await User.findOne({
        $or: [{ email }, { password }]
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
        throw new ApiError(401, "Invalid Password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    };
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken,
            },
            "User Logged In Successfully",
        ))
});

//Api request: Logout user.

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User Logout Successfully")
        )
});

//Api request: Access token refresh.

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
        
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Token");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id);
        
        if (!user) {
            throw new ApiError(401, "Invalid Token");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Token Refresh Successful"
            )
        );
    } catch (error) {
        throw new ApiError(401, error.message || "Server Error");
    }
});

//Api request: Change a password of user.

const changeUserPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const user = await User.findById(req.user?._id)
        const checkPasswordCorrectORNot = await user.isPasswordCorrect(oldPassword)
        if (!checkPasswordCorrectORNot) {
            throw new ApiError(401, "Inter Valid Password")
        }
        user.password = newPassword
        await user.save({ validateBeforeSave: false })
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "You Password Update Successfully"
                )
            );

    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error")
    }
});

//Api request: Retrive all users.

const getUserData = asyncHandler(async (req, res) => {
    try {
        const users = await User.find(req.user)
        return res.status(200)
            .json(new ApiResponse(
                200,
                users,
                "User Get Successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.messege, "Error in Users Fetched from Server")
    }
});

//Api request: Retrive user by user id.

const getUserDataById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const userGetById = await User.findById(id)
        return res.status(200)
            .json(new ApiResponse(
                200, userGetById, "This user is Exsist"
            ));
    } catch (error) {
        throw new ApiError(500, error?.messege, "Server Error during User fetched by Id")
    }
});

//Api request: Update a user.

const updateUserData = asyncHandler(async (req, res) => {
    try {

        const { email, fullName } = req.body
        if (!(email || fullName)) {
            throw new ApiError(401, "All fields are required")
        }
        const { id } = req.params
        const updateUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    email,
                    fullName,
                }
            },
            { new: true }
        ).select("-password")

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updateUser,
                "User Update Successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error during Update User")
    }
});

//Api request: Update a user avatar.

const updateUserAvatar = asyncHandler(async (req, res) => {
    const { id } = req.params
    const avatarLocalPath = req.file?.path
    // console.log(avatarLocalPath)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await fileUploadCloudinary(avatarLocalPath)
    console.log(avatar)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }
    // const id = req.user?._id 
    console.log(id)
    const user = await User.findByIdAndUpdate(
        id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Avatar image updated successfully")
        )
});

//Api request: Update a user cover image.

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const coverImagePath = req.file?.path
    if (!coverImagePath) {
        throw new ApiError(400, "coverImage file is missing")
    }
    const coverImage = await fileUploadCloudinary(coverImagePath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error in while uploading Avatar")
    }
    console.log(id)
    const user = await User.findByIdAndUpdate(
        id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "coverImage update Successfully"
            )
        )
});

//Api request: Delete a user.

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await User.findByIdAndDelete(id)

        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    deleteUser,
                    "User Deleted Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500, error?.message, "Server Error while delete User Data")
    }
});

// ============ Agregation Pipeline
// use case: for passing data multiple stages and filter data at each stage for desired result

//Api request: Retrive Channel Profile.

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username) {
        throw new ApiError(400, "Username not found")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {        // support left join
                from: "subscriptions", // join with subscriptions model
                localField: "_id", // match subcription and chaneel id
                foreignField: "channel", // match
                as: "subscribers" // new name
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false,
                    }
                }
            }
        },
        {
            $project: {
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                username: 1,
                fullName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
            }
        }

    ]);

    console.log(channel)
    if (!channel.length) {
        throw new ApiError(400, "Channel not Found")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, channel[0], "Channel fetched Successfully")
        )

});

//Api request: Retrive User watch history.

const getUserWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match:{
               _id: new mongoose.Types.ObjectId(req.user._id)
            }
            
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner:{ 
                                $first: "$owner",

                            }
                        }

                    }
                ]
            }
        }
    ])
    return res.status(200)
    .json(
        new ApiResponse(200, user[0].wathchHistory, "Watch History get Successfully")
    )
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getUserData,
    updateUserData,
    deleteUser,
    getUserDataById,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
}
