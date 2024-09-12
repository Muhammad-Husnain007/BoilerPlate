import { Router } from "express";
import {
    changeUserPassword, deleteUser, getUserData, getUserDataById,
    refreshAccessToken, updateUserAvatar, updateUserCoverImage, updateUserData,
    loginUser, logoutUser, registerUser,
    getUserChannelProfile,
    getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {  // optional
            name: "coverImage",
            maxCount: 1,
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refresh-token").post(verifyJwt, refreshAccessToken)
router.route("/change-password").post(verifyJwt, changeUserPassword)
router.route("/delete-user/:id").delete(verifyJwt, deleteUser)
router.route("/update-user/:id").put(verifyJwt, updateUserData)
router.route("/update-user-avatar/:id").patch(upload.single("avatar"), updateUserAvatar)
router.route("/update-user-coverImage/:id").patch(upload.single("coverImage"), updateUserCoverImage)

// =============== Get Requests

router.route("/get-user").get(verifyJwt, getUserData)
router.route("/c/:username").get(verifyJwt, getUserChannelProfile)
router.route("/get-user/:id").get(verifyJwt, getUserDataById)
router.route("/get-user-watchHistory").get(verifyJwt, getUserWatchHistory)


export default router;