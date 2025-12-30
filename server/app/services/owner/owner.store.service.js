/**
 * @file app/services/owner/owner.store.service.js
 * @description 매장관리 Service
 * 251229 CK init
 */

import db from "../../models/index.js";
import myError from "../../errors/customs/my.error.js";
import ownerStoreRepository from "../../repositories/owner/owner.store.repository.js";
import { CONFLICT_ERROR, FORBIDDEN_ERROR, NOT_FOUND_ERROR } from "../../../configs/responseCode.config.js";

/**
 * 새로운 매장 생성
 * @param {number} ownerId 
 * @param {object} storeData 
 * @returns {Promise<object>}
 */
async function createStore(ownerId, { name, addr1, addr2, addr3, phoneNumber }, t = null) {
  if (!ownerId || !name || !addr1 || !addr2 || !addr3) {
    throw myError('필수 매장 정보가 누락되었습니다.', CONFLICT_ERROR);
  }

  const newStoreInstance = await ownerStoreRepository.createStore(t, {
    ownerId,
    name, 
    addr1,
    addr2,
    addr3,
    phoneNumber : phoneNumber || null,
  });
  
  return newStoreInstance.get({ plain: true });
}

/**
 * 특정 점주 매장 검색
 * @param {number} ownerId 
 * @returns {Promise<Array<object>>}
 */
async function getStoresByOwnerId(ownerId, t = null) {
  if(!ownerId) {
    throw myError('점주 ID가 누락되었습니다.', NOT_FOUND_ERROR);
  }

  const stores = await ownerStoreRepository.findAllStores(t, {
    where: { ownerId },
  });

  const plainStores = stores.map(instance => instance.get({ plain: true }));

  return plainStores;
}

/**
 * 매장 삭제 
 * @param {number} storeId 
 * @param {number} ownerId 
 * @returns {Promise<number>}
 */
async function deleteStore(storeId, ownerId, t = null) {
  if(!storeId || !ownerId) {
    throw myError('매장 ID 또는 점주 ID가 누락되었습니다.', NOT_FOUND_ERROR);
  }

  // 매장 소유주 확인
  const store = await ownerStoreRepository.findOneStore(t, {
    where: {
      id: storeId
    }
  });

  if(!store) {
    throw myError('해당 매당을 찾을 수 없습니다.', NOT_FOUND_ERROR);
  }

  if(store.ownerId !== ownerId) {
    throw myError('해당 매장을 삭제할 권한이 없습니다.', FORBIDDEN_ERROR);
  }

  const deletedCount = await ownerStoreRepository.destroyStore(t, {
    where: {
      id: storeId
    }
  });

  return deletedCount;
}

export default {
  createStore,
  getStoresByOwnerId,
  deleteStore,
}