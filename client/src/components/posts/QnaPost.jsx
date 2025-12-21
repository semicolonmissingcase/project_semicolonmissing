import "./QnaPost.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TableUi from "./table/TableUi.jsx";

export default function QnaPost () {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('owner'); // 'owner' 또는 'cleaner'
  const [openIndex, setOpenIndex] = useState(null); // 열린 FAQ 인덱스
  const [posts, setPosts] = useState([]); // 게시글 데이터
  const [loading, setLoading] = useState(true);

  // FAQ 데이터
  const faqData = {
    owner: [
      { q: "제빙기 청소는 얼마나 자주 해야 하나요?", a: "일반적으로 3개월에 한 번 정기 청소를 권장합니다." },
      { q: "청소 비용은 어떻게 되나요?", a: "제빙기 크기와 상태에 따라 5만원~15만원 사이입니다." },
      { q: "예약 취소는 어떻게 하나요?", a: "예약 관리 페이지에서 24시간 전까지 취소 가능합니다." },
      { q: "청소 시간은 얼마나 걸리나요?", a: "일반적으로 1~2시간 정도 소요됩니다." },
    ],
    cleaner: [
      { q: "기사 등록은 어떻게 하나요?", a: "회원가입 후 기사 인증 서류를 제출하시면 됩니다." },
      { q: "수수료는 얼마인가요?", a: "건당 결제 금액의 10%입니다." },
      { q: "정산은 언제 되나요?", a: "매주 월요일에 전주 작업분이 정산됩니다." },
      { q: "보험은 어떻게 되나요?", a: "작업 중 발생한 사고는 플랫폼 보험으로 처리됩니다." },
    ]
  };

  // 서버에서 게시글 데이터 가져오기
  useEffect(() => {
    setLoading(true);
    fetch('/api/qna/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        // 테스트용 샘플 데이터
        setPosts([
          {
            id: 1,
            status: 'completed',
            category: 'icemaker',
            title: '제빙기 청소 비용 문의드립니다',
            author: '홍길동',
            createdAt: '2024-12-20T10:30:00',
            views: 152,
            commentCount: 3
          },
          {
            id: 2,
            status: 'pending',
            category: 'refrigerator',
            title: '냉장고 냉매 충전 가능한가요?',
            author: '김철수',
            createdAt: '2024-12-21T15:20:00',
            views: 87,
            commentCount: 1
          },
          {
            id: 3,
            status: 'pending',
            category: 'freezer',
            title: '냉동고 소음이 심한데 점검 부탁드립니다',
            author: '이영희',
            createdAt: '2024-12-22T09:15:00',
            views: 45,
            commentCount: 0
          },
        ]);
      });
  }, []);

  // 테이블 컬럼 정의
  const columns = [
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      enableSorting: true,
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <span className={`status-badge status-${status}`}>
            {status === 'completed' ? '완료' : '미완료'}
          </span>
        );
      },
    },
    {
      accessorKey: 'category',
      header: '카테고리',
      size: 120,
      enableSorting: true,
      cell: ({ getValue }) => {
        const categoryMap = {
          'icemaker': '제빙기',
          'refrigerator': '냉장고',
          'freezer': '냉동고',
          'etc': '기타'
        };
        return categoryMap[getValue()] || getValue();
      },
    },
    {
      accessorKey: 'title',
      header: '제목',
      enableSorting: true,
      cell: ({ row }) => (
        <a 
          href={`/qnaposts/${row.original.id}`}
          className="post-title-link"
        >
          {row.original.title}
          {row.original.commentCount > 0 && (
            <span className="comment-count"> [{row.original.commentCount}]</span>
          )}
        </a>
      ),
    },
    {
      accessorKey: 'author',
      header: '작성자',
      size: 120,
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
      size: 150,
      enableSorting: true,
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
          return `${hours}시간 전`;
        }
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      },
    },
    {
      accessorKey: 'views',
      header: '조회수',
      size: 100,
      enableSorting: true,
    },
  ];

  // 토글 함수
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  function qnaPostCreate() {
    navigate('/qnaposts/create');
  }

  return (
    <div className="qnapost-main-container">
      <div className="all-container qnapost-container">
        <h2>주요 문의 사항</h2>

        {/* 사용자 유형 선택 */}
        <div className="qnapost-btn-container">
          <button 
            className={`btn-medium ${userType === 'owner' ? 'bg-darkblue' : 'bg-blue'}`}
            onClick={() => {
              setUserType('owner');
              setOpenIndex(null); // 타입 변경 시 모두 닫기
            }}
          >
            점주님용
          </button>
          <button 
            className={`btn-medium ${userType === 'cleaner' ? 'bg-darkblue' : 'bg-blue'}`}
            onClick={() => {
              setUserType('cleaner');
              setOpenIndex(null);
            }}
          >
            기사님용
          </button>
        </div>

        {/* FAQ 아코디언 */}
        <div className="qnapost-qna-box">
          {faqData[userType].map((faq, index) => (
            <div key={index} className="qnapost-item-wrapper">
              <div 
                className="qnapost-item"
                onClick={() => toggleFaq(index)}
              >
                <span>Q. {faq.q}</span>
                <span className="qnapost-arrow">
                  {openIndex === index ? '▲' : '▼'}
                </span>
              </div>
              {openIndex === index && (
                <div className="qnapost-answer">
                  A. {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 문의하기 버튼 */}
        <button className="bg-blue btn-big" onClick={qnaPostCreate}>
          1 : 1 문의하러 가기
        </button>

        {/* 게시글 목록 테이블 */}
        <div className="qnapost-table-section">
          <h3>문의 게시판</h3>
          {loading ? (
            <div className="qnapost-loading">로딩 중...</div>
          ) : (
            <TableUi 
              data={posts} 
              columns={columns}
              showSearch={true}
              showPagination={true}
              pageSize={10}
            />
          )}
        </div>
      </div>
    </div>
  );
}