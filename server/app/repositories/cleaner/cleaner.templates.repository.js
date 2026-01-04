import db from '../models/index.js';

const TemplateRepository = {
  // 기사 ID로 템플릿 목록 조회
  findAllByCleanerId: async (cleanerId) => {
    return await db.Template.findAll({
      where: { cleanerId, deletedAt: null },
      order: [['createdAt', 'DESC']],
    });
  }
};

export default TemplateRepository;