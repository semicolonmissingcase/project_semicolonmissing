/**
 * @file app/middlewares/multer/multer.middleware.js
 * @description multer 미들웨어(업로더를 모아서 내보내기)
 * 260102 v1.0.0 seon init
 */

import postUploader from "./uploaders/post.uploader.js";
import profileUploader from "./uploaders/profile.uploader.js";
import chatUpload from "./uploaders/chat.upload.js";
import editorImageUploader from "./uploaders/editorImage.uploader.js";
import inquiryImageUploader from "./uploaders/inquiryImage.uploader.js"
import cleanerProfileUploader from "./uploaders/cleanerprofile.uploader.js";
import reservationImageUploader from "./uploaders/reservationImage.uploader.js";

export default {
  postUploader,
  profileUploader,
  chatUpload,
  editorImageUploader,
  inquiryImageUploader,
  cleanerProfileUploader,
  reservationImageUploader,
}