import "./TodayJobList.css";
import { FaMapMarkerAlt } from "react-icons/fa";

// DUMMY_JOBS 데이터 (예약 상태: jobStatus, 정산 상태: settlementStatus)
const DUMMY_JOBS = [
    { id: "j1", date: "2025-12-01", time: "10:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "j2", date: "2025-12-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "j3", date: "2025-12-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "j4", date: "2025-12-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j5", date: "2025-12-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "j6", date: "2025-12-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
    { id: "j7", date: "2025-12-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
    { id: "j8", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 북구 대학로 21", owner: "오대학" },
    { id: "j16", date: "2025-12-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "j37", date: "2025-12-11", time: "11:00", title: "대학가 스타 카페 B", amount: 45000, jobStatus: "취소", settlementStatus: "정산완료", canceled: true, address: "대구광역시 북구 대학로 21", owner: "오대학" },
    { id: "j9", date: "2025-12-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
    { id: "j10", date: "2025-12-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
    { id: "j11", date: "2025-12-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "j12", date: "2025-12-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "j13", date: "2025-12-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "j14", date: "2025-12-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j15", date: "2025-12-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "완료", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
    { id: "j17", date: "2025-12-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
    { id: "j18", date: "2025-12-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산완료", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j19", date: "2025-12-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
    { id: "j20", date: "2025-12-29", time: "11:00", title: "시내 이디야", amount: 45000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 11", owner: "최디야" },
    { id: "j21", date: "2025-12-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
    { id: "j22", date: "2025-12-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
    { id: "j23", date: "2025-12-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
    { id: "j24", date: "2025-12-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
    { id: "j25", date: "2025-12-31", time: "13:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 8", owner: "박커피" },
    { id: "j26", date: "2025-12-31", time: "14:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 9", owner: "최커피" },
    { id: "j27", date: "2025-12-31", time: "15:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 10", owner: "정커피" },
    { id: "j28", date: "2025-12-31", time: "16:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 11", owner: "윤커피" },
    { id: "j29", date: "2025-12-31", time: "17:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 12", owner: "한커피" },
    { id: "j30", date: "2026-01-01", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "j31", date: "2026-01-02", time: "11:00", title: "상인동 유명한 카페2", amount: 60000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" }, // 오늘(2026-01-02)의 작업
    { id: "j32", date: "2026-01-03", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "j33", date: "2026-01-04", time: "10:00", title: "남일동 아주 유명한 카페2", amount: 80000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j34", date: "2026-01-04", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 90000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "j35", date: "2026-01-08", time: "11:00", title: "시내 중앙 카페", amount: 120000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 50", owner: "정중앙" },
    { id: "j36", date: "2026-01-11", time: "10:00", title: "대학가 스타 카페", amount: 45000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 20", owner: "권대학" },
    { id: "j38", date: "2026-01-15", time: "11:00", title: "상인동 유명한 카페3", amount: 55000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 125", owner: "이영희" },
    { id: "j39", date: "2026-01-17", time: "11:00", title: "남일동 아주 유명한 카페4", amount: 65000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 104", owner: "한상사" },
    { id: "j40", date: "2026-01-22", time: "11:00", title: "상인동 유명한 카페1", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 123", owner: "김상인" },
    { id: "j41", date: "2026-01-22", time: "13:00", title: "상인동 유명한 카페2", amount: 50000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 달서구 상인동 456", owner: "박상인" },
    { id: "j42", date: "2026-01-23", time: "11:00", title: "남일동 아주 유명한 카페1", amount: 50000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 101", owner: "이남일" },
    { id: "j43", date: "2026-01-24", time: "11:00", title: "남일동 아주 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j44", date: "2026-01-28", time: "11:00", title: "남일동 유명한 카페2", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 106", owner: "정남일" },
    { id: "j45", date: "2026-01-26", time: "11:00", title: "남일동 아주 유명한 카페3", amount: 70000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 103", owner: "최남일" },
    { id: "j46", date: "2026-01-28", time: "15:00", title: "남일동 유명한 카페1", amount: 80000, jobStatus: "승인", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 105", owner: "박남일" },
    { id: "j47", date: "2026-01-28", time: "17:00", title: "남일동 아주 유명한 카페2", amount: 95000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 남일동 102", owner: "김남일" },
    { id: "j48", date: "2026-01-29", time: "10:00", title: "시내 스타벅스", amount: 105000, jobStatus: "진행중", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 동성로 10", owner: "김스타" },
    { id: "j49", date: "2026-01-30", time: "11:00", title: "대학로 유명 까페", amount: 88000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 북구 대학로 30", owner: "김대학" },
    { id: "j50", date: "2026-01-31", time: "10:00", title: "서점 근처 찻집", amount: 60000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 5", owner: "오서점" },
    { id: "j51", date: "2026-01-31", time: "11:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 6", owner: "김커피" },
    { id: "j52", date: "2026-01-31", time: "12:00", title: "서점 근처 커피숍", amount: 50000, jobStatus: "요청", settlementStatus: "정산대기", canceled: false, address: "대구광역시 중구 계명대동문 7", owner: "이커피" },
];


export default function TodayJobList() {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const todayDate = getTodayDate();

  // 오늘 날짜에 해당하는 작업 목록을 필터링합니다.
  const todayJobs = DUMMY_JOBS.filter(job => job.date === todayDate);

  // 카카오맵 열기 함수
  function openKakaoMap(location) {
    const kakaoMapUrl = `kakaomap://search?q=${encodeURIComponent(location)}`;
    const webMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(location)}`;
    
    // 모바일에서 앱 열기 시도
    window.location.href = kakaoMapUrl;
    
    // 앱이 설치되어 있지 않으면 웹으로 이동 (2초 후)
    setTimeout(() => {
      // 윈도우가 이미 카카오맵 앱 열기로 리디렉션되었을 수 있으므로, 
      // 앱이 열리지 않았을 때만(2초 후에도 현재 페이지가 유지될 때만) 웹으로 이동합니다.
      window.open(webMapUrl, '_blank');
    }, 2000);
  }

  // 매장명과 주소를 합쳐서 카카오맵 검색어로 사용합니다.
  // 매장 이름만 사용할지, 주소까지 합쳐서 사용할지는 서비스 기획에 따라 결정하시면 됩니다.
  const getMapQuery = (title, address) => {
    // 매장 이름이 가장 명확하므로, 매장 이름으로 우선 검색하고, 주소는 검색어의 정확도를 높이는 보조 역할로 사용합니다.
    return `${title} ${address}`;
  }

  // 오늘 작업이 없을 경우 표시할 내용
  if (todayJobs.length === 0) {
    return (
      <div className="todayJobList-container">
        <h2 className="todayJobList-date">{todayDate}</h2>
        <div className="todayJobList-no-jobs">
          <p>오늘은 예정된 작업이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todayJobList-container">
      {/* 오늘 날짜 표시 */}
      <h4 className="todayJobList-date">{todayDate}</h4>

      {/* 작업 목록 카드 - 오늘 작업만 map으로 렌더링 */}
      <div className="todayJobList-cards">
        {todayJobs.map(job => (
          <div key={job.id} className="todayJobList-card card-shadow">
            
            {/* 매장명 (클릭 시 지도 검색) */}
            <div className="todayJobList-card-row">
              <div className="completedjoblist-card-place">
                <FaMapMarkerAlt 
                  style={{ fontSize: '1rem', color: '#7C7F88', cursor: "pointer" }}
                  // 매장명과 주소를 합친 쿼리로 지도 검색 함수를 실행합니다.
                  onClick={() => openKakaoMap(getMapQuery(job.title, job.address))}
                />
                <span className="completedjoblist-card-value">{job.title}</span>
              </div>
              {/* 예약 상태 표시 */}
              <span className={`todayJobList-status status-${job.jobStatus}`}>
                {job.jobStatus}
              </span>
            </div>

            {/* 시간 */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">시간</span>
              <span className="todayJobList-card-value">{job.time}</span>
            </div>

            {/* 위치 (주소) */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">위치</span>
              <span className="todayJobList-card-value">{job.address}</span>
            </div>

            {/* 점주 이름 */}
            <div className="todayJobList-card-row">
              <span className="todayJobList-card-label">점주</span>
              <span className="todayJobList-card-value">{job.owner}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}