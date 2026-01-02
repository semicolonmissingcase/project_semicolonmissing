/**
 * @file app/controllers/owner/owner.user.controller.js
 * @description 점주 회원가입 관련 컨트롤러
 * 251223 v1.0.0 ck init
 */

import { BAD_FILE_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import ownerUserService from "../../services/owner/owner.user.service.js";
import myError from "../../errors/customs/my.error.js";
import path from 'path';

/**
 * 점주 회원가입 요청 처리
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function registerOwner(req, res, next) {
  try {
    const data = {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    };

    if(req.body.store) {
      data.store = {
        name: req.body.store.name,
        addr1: req.body.store.addr1,
        addr2: req.body.store.addr2,
        addr3: req.body.store.addr3,
        phoneNumber: req.body.store.phoneNumber,
      };
    }

    const createdOwner = await ownerUserService.store(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, createdOwner));
  } catch (error) {
    return next(error);
  }
}

/**
 * 점주 프로필 이미지 업데이트 요청 처리
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function uploadProfileImage(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { filename } = req.file;
    const basePath = process.env.ACCESS_FILE_USER_PROFILE_PATH;

    const relativeFilePath = path.posix.join(basePath, filename);

    await ownerUserService.updateProfile(ownerId, relativeFilePath);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {
      profileImageUrl: relativeFilePath,
      message: '프로필 이미지가 성공적으로 업데이트되었습니다.'
    }));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 마이페이지 통계 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getOwnerStats(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stats = await ownerUserService.getOwnerStats(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, stats));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 예약 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getOwnerReservations(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stats = await ownerUserService.getOwnerReservations(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, stats));
  } catch (error) {
    next(error);
  }
}

export default {
  registerOwner,
  uploadProfileImage,
  getOwnerStats,
  getOwnerReservations,
}