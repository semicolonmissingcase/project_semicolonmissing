/**
 * @file app/controllers/cleaners/cleaner.locations.controller.js
 * @description locations 관련 컨트롤러
 * 250106 v1.0.0 yh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";
import locationsService from "../../services/cleaner/cleaner.locations.service.js";
 

  async function registerCleanerLocations(req, res, next) {
  try {
 
    const result = await locationsService.getLocations();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}


export default {
  registerCleanerLocations
}