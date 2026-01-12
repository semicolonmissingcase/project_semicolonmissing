import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "./CleanersTopSummary.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cleanersThunk from "../../../store/thunks/cleanersThunk";
import { clearCleaners } from "../../../store/slices/cleanersSlice";

// 1. 데이터 정의 (컴포넌트 외부)
const DUMMY_JOBS = [
  { id: "1", date: "2025-12-01", time: "10:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
  { id: "2", date: "2025-12-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
  { id: "3", date: "2025-12-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
  { id: "4", date: "2025-12-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "5", date: "2025-12-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
  { id: "6", date: "2025-12-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
  { id: "7", date: "2025-12-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
  { id: "8", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 21", owner: "오대학" },
  { id: "16", date: "2025-12-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 중구 남일동 103", owner: "최남일" },
  { id: "37", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 북구 대학로 21", owner: "오대학" },
  { id: "9", date: "2025-12-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
  { id: "10", date: "2025-12-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
  { id: "11", date: "2025-12-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
  { id: "12", date: "2025-12-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
  { id: "13", date: "2025-12-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
  { id: "14", date: "2025-12-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "15", date: "2025-12-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
  { id: "17", date: "2025-12-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
  { id: "18", date: "2025-12-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "19", date: "2025-12-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
  { id: "20", date: "2025-12-29", time: "11:00", title: "시내 이디야", amount: 45000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 11", owner: "최디야" },
  { id: "21", date: "2025-12-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
  { id: "22", date: "2025-12-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
  { id: "23", date: "2025-12-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
  { id: "24", date: "2025-12-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
  { id: "25", date: "2025-12-31", time: "13:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 8", owner: "박커피" },
  { id: "26", date: "2025-12-31", time: "14:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 9", owner: "최커피" },
  { id: "27", date: "2025-12-31", time: "15:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 10", owner: "정커피" },
  { id: "28", date: "2025-12-31", time: "16:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 11", owner: "윤커피" },
  { id: "29", date: "2025-12-31", time: "17:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 12", owner: "한커피" },
  { id: "30", date: "2026-01-01", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
  { id: "31", date: "2026-01-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
  { id: "32", date: "2026-01-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
  { id: "33", date: "2026-01-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "34", date: "2026-01-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
  { id: "35", date: "2026-01-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
  { id: "36", date: "2026-01-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
  { id: "38", date: "2026-01-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
  { id: "39", date: "2026-01-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
  { id: "40", date: "2026-01-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
  { id: "41", date: "2026-01-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
  { id: "42", date: "2026-01-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
  { id: "43", date: "2026-01-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "44", date: "2026-01-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
  { id: "45", date: "2026-01-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
  { id: "46", date: "2026-01-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
  { id: "47", date: "2026-01-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
  { id: "48", date: "2026-01-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
  { id: "49", date: "2026-01-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
  { id: "50", date: "2026-01-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
  { id: "51", date: "2026-01-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
  { id: "52", date: "2026-01-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
];

// 2. 정산 계산 함수 정의 (단 한 번만 정의)
function calculateSettlement(jobs) {
  const result = {
    expectedDeposit: 0,
    settledComplete: 0,
  };

  jobs.forEach((job) => {
    if (job.canceled) return;
    if (job.settlementStatus === "정산완료") {
      result.settledComplete += job.amount;
    } else if (job.settlementStatus === "정산대기") {
      result.expectedDeposit += job.amount;
    }
  });

  return result;
}

// 3. 메인 컴포넌트
function CleanersTopSummary({ summary }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { currentId: paramId } = useParams(); // 2. URL에서 ID 가져오기

  // 3. 중복된 로직을 하나로 통합
  const currentId = useSelector((state) => {
    // 우선순위 1: URL 파라미터가 있으면 그걸 사용 (가장 확실한 경로)
    if (paramId) return paramId;

    // 우선순위 2: 로그인한 유저 정보가 있으면 사용
    if (state.auth?.user?.id) return state.auth.user.id;

    // 우선순위 3: 클리너 스토어에 저장된 ID가 있다면 사용

    if (state.cleaners?.id) return state.cleaners.id;

    return null;
  });


  useEffect(() => {
    // currentId가 'true' 같은 불리언이 아니라 숫자/문자일 때만 실행
    if (currentId && currentId !== true) {
      dispatch(cleanersThunk.fetchAccounts(currentId));
    }
  }, [dispatch, currentId]);

  useEffect(() => {
    if (currentId) {
      dispatch(cleanersThunk.fetchAccounts(currentId));
    }
    return () => {
      dispatch(clearCleaners());
    };
  }, [dispatch, currentId]);

  // 계산 및 날짜 포맷팅
  const calcResult = calculateSettlement(DUMMY_JOBS);
  const dateSource = summary?.summaryDate ?? new Date();
  const formattedDate = format(new Date(dateSource), "yyyy년 M월 d일 eeee", {
    locale: ko,
  });

  return (
    <div className="cleaners-top-summary-wrapper">
      <div className="cleaners-top-summary-title">현재 정산 상태</div>
      <p className="cleaners-top-summary-date">{formattedDate}</p>

      <div className="cleaners-top-summary-amounts">
        <dl className="cleaners-top-summary-amount-item">
          <dt>입금 예정:</dt>
          <dd>{calcResult.expectedDeposit.toLocaleString()} 원</dd>
        </dl>
        <dl className="cleaners-top-summary-amount-item">
          <dt>정산 완료:</dt>
          <dd>{calcResult.settledComplete.toLocaleString()} 원</dd>
        </dl>
      </div>

      <button
        className="cleaners-top-summary-account-edit-btn"
        onClick={() => {
          if (currentId) {
            navigate(`/cleaners/accountedit/${currentId}`);
          } else {
            alert("사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.");
          }
        }}
      >
        계좌 수정
      </button>
    </div>
  );
}

export default CleanersTopSummary;