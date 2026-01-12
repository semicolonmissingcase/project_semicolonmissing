import "./QnaPost.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TableUi from "./table/TableUi.jsx";
import { getAllInquiries } from "../../api/axiosPost.js";
import dayjs from 'dayjs';

export default function QnaPost () {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('owner'); // 'owner' 또는 'cleaner'
  const [openIndex, setOpenIndex] = useState(null); // 열린 FAQ 인덱스
  // 게시글 데이터, 페이지네이션
  const [inquiries, setInquiries] = useState([]); // 게시글 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지
  const [pageSize, setPageSize] = useState(10); // 페이지당 항목 수
  const [totalCount, setTotalCount] = useState(0); // 총 게시글 수

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
    const fetchInquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllInquiries(page, pageSize);

        setInquiries(response.data.rows);
        setTotalCount(response.data.count);
      } catch (err) {
        console.error("문의 목록 불러오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [page, pageSize]);

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
          <span className={`status-badge ${status === '답변완료' ? 'status-completed' : 'status-pending'}`}>
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
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: 'title',
      header: '제목',
      enableSorting: true,
      cell: ({ row }) => (
        <a 
          href={`/qnaposts/show/${row.original.id}`}
          className="post-title-link"
        >
          {row.original.title}
        </a>
      ),
    },
    {
      accessorKey: 'author',
      header: '작성자',
      size: 120,
      enableSorting: true,
      cell: ({ row }) => {
        const post = row.original;
        // 비회원인 경우 guestName (이메일), 회원인 경우 name (owner.name 또는 cleaner.name)
        return post.guestName || post.owner?.name || post.cleaner?.name || '알 수 없음';
      },
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
      size: 150,
      enableSorting: true,
      cell: ({ getValue }) => {
        const date = dayjs(getValue());
        return date.format('YYYY-MM-DD');
      },
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

        {/* 상단부분 */}
        <h2>주요 문의 사항</h2>
        <div className="qnapost-btn-container">
          <button 
            className={`btn-medium ${userType === 'owner' ? 'bg-darkblue' : 'bg-blue'}`}
            onClick={() => { setUserType('owner'); setOpenIndex(null); }}
          >
            점주님용
          </button>
          <button 
            className={`btn-medium ${userType === 'cleaner' ? 'bg-darkblue' : 'bg-blue'}`}
            onClick={() => { setUserType('cleaner'); setOpenIndex(null); }}
          >
            기사님용
          </button>
        </div>

        <div className="qnapost-qna-box">
          {faqData[userType].map((faq, index) => (
            <div key={index} className="qnapost-item-wrapper">
              <div className="qnapost-item" onClick={() => toggleFaq(index)}>
                <span>Q. {faq.q}</span>
                <span className="qnapost-arrow">{openIndex === index ? '▲' : '▼'}</span>
              </div>
              {openIndex === index && (
                <div className="qnapost-answer">A. {faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <button className="bg-blue btn-big" onClick={qnaPostCreate}>
          1 : 1 문의하러 가기
        </button>

        {/* 게시글 목록 테이블 섹션 */}
        <div className="qnapost-table-section">
          {loading ? (
            <div className="qnapost-loading">로딩 중...</div>
          ) : error ? (
            <div className="qnapost-error">문의 목록을 불러오는데 오류가 발생했습니다: {error.message}</div>
          ) : (
            <div className="table-wrapper-custom">
              <TableUi 
                data={inquiries} 
                columns={columns}
                showSearch={true}
                showPagination={true}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}