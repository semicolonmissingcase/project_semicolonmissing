import { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from "react-icons/io"; 
import cleanersThunk from "../../store/thunks/cleanersThunk.js";
import { FaMapMarkerAlt } from "react-icons/fa";
import { clearCleaners } from "../../store/slices/cleanersSlice.js";
import { CiUser } from "react-icons/ci";
import { MdHomeWork } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import './CleanersUserQuotations.css';

function CleanersUserQuotations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, reservations, isLasted } = useSelector((state) => state.cleaners);
  const { user } = useSelector(state => state.auth);

  function getNextPage() {
    dispatch(cleanersThunk.indexThunk());
  }

  function notInfoText(str) {
    if(!str || str.length <= 0) {
      return '정보 없음';
    }
    return str;
  }

  useEffect(() => {
    dispatch(cleanersThunk.indexThunk());
    return () => dispatch(clearCleaners());
  }, [dispatch]);

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="all-container cleaners-user-quotations-container"> 
      <span className="cleaners-user-quotations-title">{`안녕하세요, ${user?.name || "기사"} 님! 요청 의뢰서입니다.`}</span>

      <div className="cleaners-user-quotations-main">
        {
          reservations && reservations.map(reservation => {
            return (
              <div 
                key={`cuq-${reservation.id}`} 
                className={`cleaners-user-quotations-item`}
                onClick={() => navigate(`/cleaners/quotations/${reservation.id}`)}
              >
                <div className={`cleaners-user-quotations-item-status`}>{reservation.isAssign}</div>

                <div className={`cleaners-user-quotations-icon-box cleaners-user-quotations-item-addr`}>
                  <FaMapMarkerAlt size={25} className="cleaners-user-quotations-icon-flex" />
                  <div className="cleaners-user-quotations-item-content-flex">
                    <p className="">{notInfoText(reservation.store?.addr1)}</p>
                    <p className="">{notInfoText(reservation.store?.addr2)}</p>
                  </div>
                </div>

                <div className={`cleaners-user-quotations-item-contents`}>
                  <div className={`cleaners-user-quotations-icon-box`}>
                    <MdHomeWork size={25} />
                    <div className="cleaners-user-quotations-item-content-flex">
                      <p className="">{notInfoText(reservation.store?.name)}</p>
                    </div>
                  </div>
                  <div className={`cleaners-user-quotations-icon-box`}>
                    <CiUser size={25} />
                    <div className="cleaners-user-quotations-item-content-flex">
                      <p className="">{notInfoText(reservation.store?.owner?.name)}</p>
                    </div>
                  </div>
                  <div className={`cleaners-user-quotations-icon-box`}>
                    <LuCalendarClock size={25} />
                    <div className="cleaners-user-quotations-item-content-flex">
                      <p className="">{notInfoText(reservation.date)}</p>
                      <p className="">{notInfoText(reservation.time?.substring(0, 5))}</p>
                    </div>
                  </div>
                  <div className="cleaners-user-quotations-img-frame">
                    <div className="cleaners-user-quotations-profile-placeholder" />
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      {
      !isLasted && (
        <div className="cleaners-user-quotations-button-wrapper" onClick={getNextPage}>
          <IoMdAddCircleOutline size={45} color="var(--color-blue)" />
          <p style={{ marginTop: '5px', color: 'var(--color-blue)' }}>더 보기</p>
        </div>
      )
      }
    </div>
  );
}

export default CleanersUserQuotations;