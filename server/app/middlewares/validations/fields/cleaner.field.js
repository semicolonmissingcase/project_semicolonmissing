import { body, param } from "express-validator";
import PROVIDER from "../../auth/configs/provider.enum.js";

const name = body('name')
  .trim()
  .notEmpty()
  .withMessage("이름은 필수 항목입니다.");

const gender = body('gender')
  .trim()
  .notEmpty()
  .withMessage('성별은 필수 항목입니다.');

const provider = param('provider')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .custom((val) => {
    return PROVIDER[val.toUpperCase()] ? true : false;
  })
  .withMessage('사용할 수 없는 문자가 있습니다. 다시 한번 확인해 주세요.');

const email = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수 항목입니다.')
  .bail()
  .isEmail()
  .withMessage('유효한 이메일을 입력해주세요.');

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('비밀번호는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9!@#$]{8,20}$/)
  .isLength({ min: 8 })
  .withMessage('비밀번호는 최소 8자 이상이어야 합니다.');

const passwordChk = body('passwordChk')
  .trim()
  .custom((val, {req}) => {
    if(val !== req.body.password) {
      return false;
    }
    return true;
  })
  .withMessage('비밀번호란과 비밀번호 확인란이 다릅니다.');

const cleaner_number = body('cleaner_number')
  .trim()
  .notEmpty()
  .withMessage("전화번호는 필수 항목입니다.");

const location_id = body('location_id')
  .trim()
  .notEmpty()
  .withMessage("지역은 필수 항목입니다.");

const reservationId = body('reservationId')
  .trim()
  .notEmpty()
  .withMessage("필수 항목입니다.")
  .isNumeric()
  .withMessage('숫자만 허용합니다.');

const estimatedAmount = body('estimatedAmount')
  .trim()
  .notEmpty()
  .withMessage("필수 항목입니다.")
  .isNumeric()
  .withMessage('숫자만 허용합니다.');

const description = body('description')
  .trim()
  .notEmpty()
  .withMessage("필수 항목입니다.");

export default {
  provider,
  name,
  gender,
  email,
  password,
  passwordChk,
  cleaner_number,
  location_id,
  reservationId,
  estimatedAmount,
  description,
}
  
//회원가입할 때 자격증 등록하는 구조인지 아니면 나중에 프로필 수정할 때 자격증 등록하는 구조인지?1