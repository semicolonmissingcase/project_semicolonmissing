async function store(data) {
  const { reservationId, answers } = data;

  return await db.sequelize.transaction(async t => {
    const submissionData = answers.map(ans => ({
      reservationId: reservationId,
      // 데이터가 없으면 null로 명시적 처리
      questionId: ans.questionId || null,
      questionOptionId: ans.questionOptionId || null, 
      answerText: ans.answerText || null,
    }));

    return await submissionRepository.bulkCreate(t, submissionData);
  });
}