/**
 * @file app/middlewares/multer/multer.middleware.js
 * @description multer 미들웨어(업로더를 모아서 내보내기)
 * 260102 v1.0.0 seon init
 */

import postUploader from "./uploaders/post.uploader.js";
import profileUploader from "./uploaders/profile.uploader.js";
import chatUpload from "./uploaders/chat.upload.js";

export default {
  postUploader,
  profileUploader,
  chatUpload
}