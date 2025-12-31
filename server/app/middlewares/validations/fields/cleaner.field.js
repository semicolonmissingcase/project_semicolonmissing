import { body } from "express-validator";
import PROVIDER from "../../auth/configs/provider.enum.js";

  export const name = body('name')
    .trim()
    .notEmpty()
    .withMessage("이름은 필수 항목입니다.")

  export const gender = body('gender')
    .trim()
    .notEmpty()
    .withMessage('성별은 필수 항목입니다.')

  export const provider = body('provider')
    .trim()
    .notEmpty()
    .withMessage('필수 항목입니다.')
    .bail()
    .custom((val) => {
      return PROVIDER[val.toUpperCase()] ? true : false;
    })
    .withMessage('사용할 수 없는 문자가 있습니다. 다시 한번 확인해 주세요.')

  export const email = body('email')
    .trim()
    .notEmpty()
    .withMessage('이메일은 필수 항목입니다.')
    .bail()
    .isEmail()
    .withMessage('유효한 이메일을 입력해주세요.')

  export const password = body('password')
    .trim()
    .notEmpty()
    .withMessage('비밀번호는 필수 항목입니다.')
    .bail()
    .matches(/^[a-zA-Z0-9!@#$]{8,72}$/) // 비밀번호 해싱하는지도 물어보기.. 해싱하면 72자 정도가 기술적인 이유로 좋은 선택이라고 함
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')

  export const passwordChk = body('passwordChk')
      .trim()
      .custom((val, {req}) => {
        if(val !== req.body.password) {
          return false;
        }
        return true;
      })
      .withMessage('비밀번호란과 비밀번호 확인란이 다릅니다.')
    
  export const phone = body('phone')
      .trim()
      .notEmpty()
      .withMessage("전화번호는 필수 항목입니다.")
    
  export const locationId = body('locationId')
      .trim()
      .notEmpty()
      .withMessage("지역은 필수 항목입니다.")

  export const profile = body("profile")
      .trim()
      .notEmpty()
      .withMessage("프로필 이미지는 필수 항목입니다.")

    export default {
      name, gender, provider, email, password,
         passwordChk, phone, locationId, profile
    }
    
    //회원가입할 때 자격증 등록하는 구조인지 아니면 나중에 프로필 수정할 때 자격증 등록하는 구조인지?