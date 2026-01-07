/**
 * @file app/repositories/cleaner/cleaner.locations.repository.js
 * @description cleaner locations Repository
 * 250106 yh init
 */

import db from "../../models/index.js";
const { Location } = db;


/**
 * id로 지역 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string} id
 * @returns {Promise<import("../models/Location.js").City>}
 */
async function findById(t = null, id) {
  
  return await Location.findOne({
  attributes: ["id", "city", "district"],
  transaction: t
});
}

async function findAll(t = null) {
  return await Location.findAll({
    attributes: ["id", "city", "district"],
    transaction: t
  });
}

async function getLocations() {
  const rows = await locationsRepository.findAll();
  return { rows }; 
}

export default {
  findById,
  findAll,
  getLocations
};