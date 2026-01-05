/**
 * @file app/controllers/owner/owner.like.controller.js
 * @description 좋아요 관리 관련 컨트롤러
 * 260102 v1.0.0 ck init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import ownerLikeService from "../../services/owner/owner.like.service.js";

/**
 * 좋아요 상태 요청
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function toggleFavorite(req, res, next) {
  try {
    const ownerId = req.user.id;
    const cleanerId = parseInt(req.params.cleanerId);

    const newFavoriteStatus = await ownerLikeService.toggleFavorite(ownerId, cleanerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {
      isFavorited: newFavoriteStatus,
      message: newFavoriteStatus ? '기사님을 찜했습니다.' : '기사님 찜을 취소했습니다.'
    }));
  } catch (error) {
    next(error);
  }
}

/**
 * 찜한 기사님 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getFavoriteCleaners(req, res, next) {
  try {    
    const ownerId = req.user.id;

    const favoriteCleaners = await ownerLikeService.getFavoriteCleaners(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, favoriteCleaners));
  } catch (error) {
    next(error);
  }
}

export default {
  toggleFavorite,
  getFavoriteCleaners,
}