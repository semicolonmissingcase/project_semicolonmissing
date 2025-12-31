/**
 * @file app/services/cleaner/cleaner.account.service.js
 * @description cleaner account Service
 * 251230 yh init
 */


import { CONFLICT_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import PROVIDER from "../../middlewares/auth/configs/provider.enum.js";
import db from "../../models/index.js";
import userRepository from "../../repositories/cleaner/cleaner.user.repository.js";
import bcrypt from "bcrypt";

/**
 * 회원 가입 처리
 * @param {import("./users.service.type.js").userStoreData} data 
 * @returns 
 */
async function store(data) {
  const { phone, gender, email, password, provider, name, profile, locationId } = data;


  return await db.sequelize.transaction(async t => {
    // 가입 유저인지 조회
    const user = await userRepository.findByEmail(t, email);

    // 중복 유저 처리
    if(user) {
      throw myError('이메일 중복', CONFLICT_ERROR);
    }

    // 가입 처리
    const createData = {
      phoneNumber: phone,
      gender,
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      profile,
      locationId,
      provider,
    }

    return await userRepository.create(t, createData);
  });
}

export default {
  store,
}