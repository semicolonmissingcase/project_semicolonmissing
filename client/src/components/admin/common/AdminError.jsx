/**
 * @file src/components/admin/common/AdminError.jsx
 * @description AdminError
 * 260109 v1.0.0 pbj init
 */
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

export default function AdminError() {
  const navigate = useNavigate();
  const { error } = useSelector(state => state.adminPagination);

  function generateErrorMsg(err) {
    if(err?.code) {
      return `${err.code}: ${err.msg}`;
    }
    return 'E90: 백앤드 오류는 아닙니다.';
  }

  return (
    <>
      <h1>오류가 발생했습니다.</h1>
      <p>{generateErrorMsg(error)}</p>
      <button onClick={() => navigate('/hospital')}>메인 페이지로 이동</button>
    </>
  )
}