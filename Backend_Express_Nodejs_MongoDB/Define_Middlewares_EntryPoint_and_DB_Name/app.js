                               // Define Middleware

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(cors({ // allow to permission access resource on other domain
    origion: process.env.CORS_ORIGION,
    credentials: true  // allow to sent cookies, authorization, heders
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// if(file above to 16kb){
//     return 413 paylod largr error
// }
app.use(express.static("public")); // handle statics file i.e css, images, js
app.use(cookieParser()); // for cookies parse means cookies easily read and accessible

            // Import Routes of all Controllers 

import userRouter from './routes/user.routes.js'
import commentRouter from './routes/comment.routes.js'
import videoRouter from './routes/video.routes.js'
import likeRouter from './routes/like.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriberRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'

app.use("/api/v1/user", userRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/subscriber", subscriberRouter)
app.use("/api/v1/playlist", playlistRouter)

export { app }