import { reservationId, settlementAmount, bank, accountNumber } from "../../fields/adjustment.field.js";

export const requestAdjustmentValidator = [
  reservationId, 
  settlementAmount, 
  bank, 
  accountNumber
];

export default {
  requestAdjustmentValidator
};