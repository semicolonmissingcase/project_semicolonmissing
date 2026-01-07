/**
 * @file app/services/cleaner/cleaner.quotations.service.js
 * @description cleaner quotations Service
 * 260106 yh init
 */

import cleanerQuotationsRepository from "../../repositories/cleaner/cleaner.quotations.repository.js"

async function getPrioritizedReservations({limit, offset}) {
  return await cleanerQuotationsRepository.findAllPrioritizedReservationsPagination(null, {limit, offset});
}

export default {
  getPrioritizedReservations,
}