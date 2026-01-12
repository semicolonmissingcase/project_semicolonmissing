/**
 * @file app/controllers/cleaners/cleaner.locations.controller.js
 * @description locations 관련 컨트롤러
 * 250106 v1.0.0 yh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import locationsService from "../../services/locations/locations.service.js";
 


  async function registerCleanerLocations(req, res, next) {
  try {
 
    const result = await locationsService.getLocations();
    return res.status(SUCCESS.status).json(createBaseResponse(SUCCESS, result));
  } catch (err) {
    next(err);
  }
}


export default {
  registerCleanerLocations
}