import { reservationId, answers, questionId, questionOptionId, answerText } from "../../fields/cleaner/cleaner.submissions.field.js";

export const createSubmissionValidator = [
  reservationId,
  answers,
  questionId,
  questionOptionId,
  answerText
];

export default {
  createSubmissionValidator
};