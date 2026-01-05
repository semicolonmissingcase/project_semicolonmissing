import db from "../../models/index.js";
const { Cleaner, CleanerLocation } = db;

async function updateProfile(cleanerId, data, file) {
  const { name, introduction, experience, locations } = data;
  const locationIds = typeof locations === 'string' ? JSON.parse(locations) : locations;

  // [임시] 경력 데이터 로그 출력 (DB 컬럼 추가 전까지)
  if (experience) console.log(`[Temp Save] Cleaner(${cleanerId}) Experience: ${experience}`);

  return await db.sequelize.transaction(async t => {
    const updateData = { name, introduction };
    
    // 사진이 업로드된 경우 경로 저장
    if (file) {
      updateData.profile = `/uploads/profiles/${file.filename}`;
    }

    // 1. 기사님 정보 업데이트
    await Cleaner.update(updateData, { where: { id: cleanerId }, transaction: t });

    // 2. 기존 지역 매핑 삭제 후 새 지역 등록
    await CleanerLocation.destroy({ where: { cleaner_id: cleanerId }, transaction: t });

    const locationMappings = locationIds.map(locId => ({
      cleaner_id: cleanerId,
      location_id: locId
    }));

    await CleanerLocation.bulkCreate(locationMappings, { transaction: t });

    return { success: true, profile: updateData.profile };
  });
}

export default { updateProfile };