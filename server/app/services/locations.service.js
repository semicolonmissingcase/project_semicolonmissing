/**
 * @file app/services/cleaner/cleaner.locations.service.js
 * @description cleaner locations Service
 * 250106 yh init
 */


import { CONFLICT_ERROR } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import PROVIDER from "../middlewares/auth/configs/provider.enum.js";
import db from "../models/index.js";
import locationsRepository from "../../repositories/locations/locations.repository.js";

/**
 * 회원 가입 활동 지역 불러오기
 */
async function getLocations() {
  
  const rows = await locationsRepository.findAll(); 
  
  return { rows };
}

export default {
  getLocations,
}