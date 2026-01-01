/**
 * @file app/controllers/cleaner/cleaner.submission.controller.js
 * @description cleaner submission 관련 컨트롤러
 * 251231 v1.0.0 yh init
 */

export const getSubmissionByReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const data = await Submission.findAll({
      where: { reservationId },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['content', 'code']
        },
        {
          model: QuestionOption,
          as: 'questionOption',
          attributes: ['correct']
        }
      ],
      order: [['questionId', 'ASC']]
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "정보 불러오기 실패", error: error.message });
  }
};