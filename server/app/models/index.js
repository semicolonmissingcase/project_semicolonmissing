/**
 * @file app/models/index.js
 * @description Sequelize 인스턴스 생성 FIle
 * 251219 v1.0.0 jae init
 */

import '../../configs/env.config.js';
import { Sequelize } from 'sequelize';
import Owner from './Owner.js';
import Cleaner from './Cleaner.js';
import Estimate from './Estimate.js';
import ChatRoom from './ChatRoom.js';
import ChatMessage from './ChatMessage.js';
import Admin from './Admin.js';
import Location from './Location.js';
import Store from './Store.js';
import Certification from './Certification.js';
import DriverRegion from './DriverRegion.js';
import Template from './Template.js';
import PushSubscription from './PushSubscription.js';
import Question from './Question.js';
import Submission from './Submission.js';
import Reservation from './Reservation.js';
import Inquiry from './Inquiry.js';
import Answer from './Answer.js';
import Review from './Review.js';
import Like from './Like.js';
import Payment from './Payment.js';
import Adjustment from './Adjustment.js';
import QuestionOption from './QuestionOption.js';
import ReservationImage from './ReservationImage.js';
import VirtualAccount from './VirtualAccount.js';
import CleanerAccount from './CleanerAccount.js';
import Notification from './Notification.js';
import BankCode from './BankCode.js';

const db = {}; // 생성할 db 인스턴스 저장용 
// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_MYSQL_DB_NAME        // DB명
  , process.env.DB_MYSQL_USER         // DB 접속 유저
  , process.env.DB_MYSQL_PASSWORD     // DB 접속 패스워드
  , {
    host: process.env.DB_MYSQL_HOST                     // 사용 DB Host
    , port: parseInt(process.env.DB_MYSQL_PORT)          // 사용 DB Port
    , dialect: process.env.DB_MYSQL_DIALECT              // 사용 DB 드라이버
    , timezone: process.env.DB_MYSQL_TIMEZONE            // 타임존
    , logging: process.env.DB_MYSQL_LOG_FLG === 'true' && console.log  // DB Loggin on/off
    // ,dialectOptions: {
    //     dateStrings: true  // 문자열로 날짜 받기
    // }
    , pool: { // 커넥션풀 설정
      max: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MAX),   // 최대 커넥션 수
      min: parseInt(process.env.DB_MYSQL_CONNECTION_COUNT_MIN),   // 최소 커넥션 수
      acquire: parseInt(process.env.DB_MYSQL_ACQUIRE_LIMIT),      // 연결 최대 대기 시간 (ms)
      idle: parseInt(process.env.DB_MYSQL_IDLE_LIMIT)             // 유휴 커넥션 유지 시간 (ms)
    }
  }
);

db.sequelize = sequelize; // 생성한 sequelize 인스턴스 db에 저장

// 모델 초기화
db.Owner = Owner.init(sequelize);
db.Cleaner = Cleaner.init(sequelize);
db.Estimate = Estimate.init(sequelize);
db.ChatRoom = ChatRoom.init(sequelize);
db.ChatMessage = ChatMessage.init(sequelize);
db.Admin = Admin.init(sequelize);
db.Location = Location.init(sequelize);
db.Store = Store.init(sequelize);
db.Certification = Certification.init(sequelize);
db.DriverRegion = DriverRegion.init(sequelize);
db.Template = Template.init(sequelize);
db.PushSubscription = PushSubscription.init(sequelize);
db.Question = Question.init(sequelize);
db.QuestionOption = QuestionOption.init(sequelize);
db.Submission = Submission.init(sequelize);
db.Reservation = Reservation.init(sequelize);
db.Inquiry = Inquiry.init(sequelize);
db.Answer = Answer.init(sequelize);
db.Review = Review.init(sequelize);
db.Like = Like.init(sequelize);
db.Payment = Payment.init(sequelize);
db.Adjustment = Adjustment.init(sequelize);
db.ReservationImage = ReservationImage.init(sequelize);
db.VirtualAccount = VirtualAccount.init(sequelize);
db.CleanerAccount = CleanerAccount.init(sequelize);
db.Notification = Notification.init(sequelize);
db.BankCode = BankCode.init(sequelize);

// 모델 관계 설정
Owner.associate(db);
Cleaner.associate(db);
Estimate.associate(db);
ChatRoom.associate(db);
ChatMessage.associate(db);
Admin.associate(db);
Location.associate(db);
Store.associate(db);
Certification.associate(db);
DriverRegion.associate(db);
Template.associate(db);
PushSubscription.associate(db);
Question.associate(db);
QuestionOption.associate(db);
Submission.associate(db);
Reservation.associate(db);
Inquiry.associate(db);
Answer.associate(db);
Review.associate(db);
Like.associate(db);
Payment.associate(db);
Adjustment.associate(db);
ReservationImage.associate(db);
VirtualAccount.associate(db);
CleanerAccount.associate(db);
BankCode.associate(db);

export default db;