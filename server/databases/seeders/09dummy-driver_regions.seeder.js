/**
 * @file databases/seeders/dummy-driver_regions.seeder.js
 * @description driver_regions table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { DriverRegion, Location } = db;

const tableName = 'driver_regions';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const seoulLocations = await Location.findAll({
      where: {
        city: '서울',
        district: ['종로구', '중구', '용산구', '성동구', '광진구']
      },
      limit: 5
    });

    const records = seoulLocations.map((location) => ({
      cleanerId: 1,      // 기사 PK
      locationId: location.id // MetaLocation에서 가져온 지역구 PK
    }));

    // 데이터 생성
    await DriverRegion.bulkCreate(records);
  },

  async down(queryInterface, Sequelize) {
    // cleanerId가 1인 데이터만 지우거나 전체 삭제
    await queryInterface.bulkDelete(tableName, { cleanerId: 1 }, {});
  }
};