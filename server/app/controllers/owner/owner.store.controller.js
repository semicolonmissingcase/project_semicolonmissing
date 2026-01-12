/**
 * @file app/controllers/owner/owner.store.controller.js
 * @description 매장 관리 관련 컨트롤러
 * 251229 v1.0.0 ck init
 */

import { BAD_REQUEST_ERROR, FORBIDDEN_ERROR, NOT_FOUND_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import ownerStoreService from "../../services/owner/owner.store.service.js";

/**
 * 새로운 매장 생성
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function createStore(req, res, next) {
  try {
    const ownerId = req.user?.id;
    const storeData = req.body.store;

    // 인증된 점주 ID 없음
    if(!ownerId) {
      return next(new Error(FORBIDDEN_ERROR.info));
    }

    // 서비스 계층으로 데이터 전달
    const newStore = await ownerStoreService.createStore(ownerId, storeData);

    // 성공 응답
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, newStore));
  } catch (error) {
    return next(error);
  }
}

/**
 * 점주 매장 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getOwnerStores(req, res, next) {
  try {
    const ownerId = req.user?.id;
    
    if(!ownerId) {
      return next(new Error(FORBIDDEN_ERROR.info));
    }

    const stores = await ownerStoreService.getStoresByOwnerId(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, stores));
  } catch (error) {
    return next(error);
  }
}

/**
 * 매장 삭제
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function deleteStore(req, res, next) {
  try {
    const ownerId = req.user?.id;
    const { storeId } = req.params;

    if(!ownerId) {
      return next(new Error(FORBIDDEN_ERROR.info));
    }

    if(!storeId || isNaN(Number(storeId))) {
      return next(new Error(BAD_REQUEST_ERROR.info));
    }

    const deletedCount = await ownerStoreService.deleteStore(Number(storeId), ownerId);

    if(deletedCount === 0) {
      return next(new Error(NOT_FOUND_ERROR.info));
    }
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { id: storeId }));
  } catch (error) {
    return next(error);
  }
}

export default {
  createStore,
  getOwnerStores,
  deleteStore,
}