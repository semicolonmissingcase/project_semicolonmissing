/**
 * @file databases/seeders/dummy-inquiries.seeder.js
 * @description inquiries table dummy data create
 * 231231 v1.0.0 jae init
 */
import db from '../../app/models/index.js';
const { Inquiry } = db;

// 테이블명 (down 메소드에서 사용)
const tableName = 'inquiries';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // 레코드 정보
    const records = [
      {
        ownerId: 1,
        title: '예약 확정 후 기사님이 연락이 두절되었습니다. 확인 부탁드립니다.',
        content: 'O월 O일 예약된 건인데, 배정된 기사님과 연락이 닿지 않고 있습니다. 당일 영업에 차질이 생길까 우려되니 확인 후 빠른 조치나 기사님 재배정 부탁드립니다.',
        status: '대기중',
      },
      {
        cleanerId: 1,
        title: '지난주 작업 완료 건에 대한 수익금 입금 확인 요청',
        content: '안녕하세요. OOO 기사입니다. 지난주(O월 O일~O월 O일) 완료된 청소 건들에 대한 정산금이 아직 입금되지 않아 문의드립니다. 마이페이지에는 정산 완료로 뜨는데 실제 통장 입금 내역이 없습니다. 확인 부탁드립니다.',
        status: '대기중',
      },
    ];

    // 데이터 생성: 모델의 bulkCreate 사용
    await Inquiry.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    // 데이터 삭제
    await queryInterface.bulkDelete(tableName, null, {});
  }
};