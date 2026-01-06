/**
 * @file databases/seeders/dummy-stores.seeder.js
 * @description stores table dummy data create based on Store model
 * 231223 v1.0.0 seon init
 */
import db from '../../app/models/index.js';
const { Store } = db;

const tableName = 'stores';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    const records = [
      {
        id: 1,
        ownerId: 1,
        name: '깨끗한 제빙기 카페',
        addr1: '서울특별시',        // 모델의 addr1 (시/도)
        addr2: '강남구 역삼동',      // 모델의 addr2 (군/구/읍/면/동)
        addr3: '1-45번지 1층',    // 모델의 addr3 (상세주소)
        phoneNumber: '0212345678', // 모델의 phoneNumber
      },
      { 
        id: 2, 
        ownerId: 2, 
        name: '얼음가득 커피숍', 
        addr1: '서울특별시', 
        addr2: '서초구 서초동', 
        addr3: '12-3번지 1층', 
        phoneNumber: '0223456789' 
      },
      { id: 3, 
        ownerId: 3, 
        name: '시원한 아아점', 
        addr1: '서울특별시', 
        addr2: '송파구 잠실동', 
        addr3: '45-1번지 2층', 
        phoneNumber: '0234567890' 
      },
      { id: 4, 
        ownerId: 4, 
        name: '강남 아이스홀릭', 
        addr1: '서울특별시', 
        addr2: '강남구 논현동', 
        addr3: '78-2번지 1층', 
        phoneNumber: '0245678901' 
      },
      { id: 5, 
        ownerId: 5, 
        name: '역삼 카페클린', 
        addr1: '서울특별시', 
        addr2: '강남구 역삼동', 
        addr3: '10-5번지 B1층', 
        phoneNumber: '0256789012' 
      },
      { id: 6, 
        ownerId: 6, 
        name: '논현 빙하커피', 
        addr1: '서울특별시', 
        addr2: '강남구 논현동', 
        addr3: '22-4번지 1층', 
        phoneNumber: '0267890123' 
      },
      { id: 7, 
        ownerId: 7, 
        name: '삼성 스노우빈', 
        addr1: '서울특별시', 
        addr2: '강남구 삼성동', 
        addr3: '33-9번지 1층', 
        phoneNumber: '0278901234' 
      },
      { id: 8, 
        ownerId: 8, 
        name: '압구정 프로스트', 
        addr1: '서울특별시', 
        addr2: '강남구 신사동', 
        addr3: '55-12번지 2층', 
        phoneNumber: '0289012345' 
      },
      { 
        id: 9, 
        ownerId: 9, 
        name: '송파 쿨가이', 
        addr1: '서울특별시', 
        addr2: '송파구 가락동', 
        addr3: '66-3번지 1층', 
        phoneNumber: '0290123456' 
      },
      { 
        id: 10, 
        ownerId: 10, 
        name: '잠실 아이스베어', 
        addr1: '서울특별시', 
        addr2: '송파구 석촌동', 
        addr3: '77-8번지 1층', 
        phoneNumber: '0201234567' 
      },
      { 
        id: 11, 
        ownerId: 11, 
        name: '마포 클린워터', 
        addr1: '서울특별시', 
        addr2: '마포구 망원동', 
        addr3: '88-1번지 1층', 
        phoneNumber: '0211223344' 
      },
      { 
        id: 12, 
        ownerId: 12, 
        name: '홍대 칠링존', 
        addr1: '서울특별시', 
        addr2: '마포구 서교동', 
        addr3: '99-4번지 2층', 
        phoneNumber: '0222334455' 
      },
      { 
        id: 13, 
        ownerId: 13, 
        name: '성수 얼음공장', 
        addr1: '서울특별시', 
        addr2: '성동구 성수동', 
        addr3: '11-2번지 1층', 
        phoneNumber: '0233445566' 
      },
      { 
        id: 14, 
        ownerId: 14, 
        name: '종로 빙수마을', 
        addr1: '서울특별시', 
        addr2: '종로구 관철동', 
        addr3: '22-7번지 1층', 
        phoneNumber: '0244556677' 
      },
      { 
        id: 15, 
        ownerId: 15, 
        name: '관악 콜드브루', 
        addr1: '서울특별시', 
        addr2: '관악구 신림동', 
        addr3: '33-1번지 1층', 
        phoneNumber: '0255667788' 
      },
      { 
        id: 16, 
        ownerId: 16, 
        name: '서초 하이얼음', 
        addr1: '서울특별시', 
        addr2: '서초구 방배동', 
        addr3: '44-9번지 1층', 
        phoneNumber: '0266778899' 
      },
      { 
        id: 17, 
        ownerId: 17, 
        name: '영등포 아이스바', 
        addr1: '서울특별시', 
        addr2: '영등포구 여의도동', 
        addr3: '55-3번지 5층', 
        phoneNumber: '0277889900' 
      },
      { 
        id: 18, 
        ownerId: 18, 
        name: '동대문 빙산카페', 
        addr1: '서울특별시', 
        addr2: '동대문구 전농동', 
        addr3: '66-2번지 1층', 
        phoneNumber: '0288990011' 
      },
      { 
        id: 19, 
        ownerId: 19, 
        name: '중구 실버벨', 
        addr1: '서울특별시', 
        addr2: '중구 을지로', 
        addr3: '77-4번지 1층', 
        phoneNumber: '0299001122' 
      },
      { 
        id: 20, 
        ownerId: 20, 
        name: '용산 프로즌', 
        addr1: '서울특별시', 
        addr2: '용산구 이태원동', 
        addr3: '88-6번지 1층', 
        phoneNumber: '0210203040' 
      },
    ];

    // 모델의 bulkCreate 사용
    await Store.bulkCreate(records);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};