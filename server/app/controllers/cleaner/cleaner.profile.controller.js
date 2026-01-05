import profileService from "../../services/cleaner/cleaner.profile.service.js";

async function update(req, res, next) {
  try {
    const cleanerId = req.user.id;
    const result = await profileService.updateProfile(cleanerId, req.body, req.file);
    
    return res.status(200).json({
      success: true,
      message: "프로필 수정이 완료되었습니다.",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export default { update };