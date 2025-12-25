import React, { useMemo, useState } from "react";
import "./CleanersQuoteListPreparationSave.css";

function CleanersQuoteListPreparation() {
  const options = [
    { value: "price_desc", label: "견적금액 ↓" },
    { value: "price_asc", label: "견적금액 ↑" },
  ];

  const [filter, setFilter] = useState(options[0].value);


  const saves = [
    {
      id: 1,
      price: 150000,
      status: "임시 저장",
      explain: "15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다... 15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다...15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다... 15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다...",
    },
    {
      id: 2,
      price: 100000,
      status: "임시 저장",
      explain: "제빙기 청소하면 김기사입니다... 제빙기 청소하면 김기사입니다...제빙기 청소하면 김기사입니다... 제빙기 청소하면 김기사입니다...",
    },
    {
      id: 3,
      price: 170000,
      status: "임시 저장",
      explain: "프리미엄 제빙기 청소 서비스의 으뜸을 말합니다... 프리미엄 제빙기 청소 서비스의 으뜸을 말합니다...프리미엄 제빙기 청소 서비스의 으뜸을 말합니다... 프리미엄 제빙기 청소 서비스의 으뜸을 말합니다...",
    },
    {
      id: 4,
      price: 150000,
      status: "임시 저장",
      explain: "15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다... 15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다...15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다... 15년 경력의 신뢰와 실력으로 검증받는 제빙기 청소 서비스입니다...",
    },
    {
      id: 5,
      price: 170000,
      status: "임시 저장",
      explain: "프리미엄 제빙기 청소 서비스의 으뜸을 말합니다... 프리미엄 제빙기 청소 서비스의 으뜸을 말합니다...프리미엄 제빙기 청소 서비스의 으뜸을 말합니다... 프리미엄 제빙기 청소 서비스의 으뜸을 말합니다...",
    },
  ];

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  // filter에 따라 정렬된 배열 만들기
  const sortedSaves = useMemo(() => {
    const copy = [...saves];

    switch (filter) {
      case "price_asc":
        return copy.sort((a, b) => a.price - b.price);
      case "price_desc":
        return copy.sort((a, b) => b.price - a.price);
      default:
        return copy;
    }
  }, [filter]); // saves가 서버에서 오면 [filter, saves]로

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  return (
    <div className="all-container cleaners-quote-list-preparation-save-container">
      <h3 className="cleaners-quote-list-preparation-save-title">자주 쓰는 견적서 양식</h3>

      <div className="cleaners-quote-list-preparation-wrapper">
        <div className="cleaners-quote-list-preparation-quote-list--filter-dropdown">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="cleaners-quote-list-preparation-quote-list-select"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {sortedSaves.map((item) => (
          <div className="cleaners-quote-list-preparation-quote-list-saves" key={item.id}>
            <div className="cleaners-quote-list-preparation-save-price-status">
              <div className="cleaners-quote-list-preparation-save-price-title">견적 금액</div>
              <div className="cleaners-quote-list-preparation-save-price">
                <span className="cleaners-quote-list-preparation-save-price-number">
                  {formatPrice(item.price)}
                </span>
                원
              </div>
              <div className="cleaners-quote-list-preparation-save-status">{item.status}</div>
            </div>

            <div className="cleaners-quote-list-preparation-save-explain">
              <div className="cleaners-quote-list-preparation-save-explain-title">견적 설명</div>
              <div className="cleaners-quote-list-preparation-save-explain-details" title={item.explain}>
                {item.explain}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CleanersQuoteListPreparation;
