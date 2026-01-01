import { reservationId, settlementAmount, bank, accountNumber } from '../../fields/cleaner/cleaner.adjustment.field.js';

export const requestAdjustmentValidator = [
  reservationId,
  settlementAmount, 
  bank, 
  accountNumber
];

export default {
  requestAdjustmentValidator
};