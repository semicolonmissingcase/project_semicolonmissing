import React, { useMemo, useState } from "react";
import Select from 'react-select';
import "./CleanersQuoteListPreparationSave.css";
import { RiArrowDropDownFill } from "react-icons/ri";
import { RiArrowDropUpFill } from "react-icons/ri";

function CleanersQuoteListPreparation() {

  const options = [
  { 
    value: "price_desc", 
    // JSX를 사용하여 아이콘과 텍스트를 함께 배열에 넣습니다.
    label: (
      <>
        견적금액 <RiArrowDropDownFill size={30} style={{ verticalAlign: "middle" }} />
      </>
    )
  },
  { value: "price_asc", 
    label: (
      <>
        견적금액 <RiArrowDropUpFill size={30} style={{ verticalAlign: "middle" }} />
      </>
    ) 
    },
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

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  
  const sortedSaves = useMemo(() => {
   
  const copy = [...saves];  
  
  switch (selectedOption.value) { 
  case "price_asc":
   
  return copy.sort((a, b) => a.price - b.price);
  case "price_desc":
 
 return copy.sort((a, b) => b.price - a.price);
 default:
 
 return copy;
  }
  }, [selectedOption.value, saves]);
 

  const formatPrice = (n) => n.toLocaleString("ko-KR");

  return (
    <div className="all-container cleaners-quote-list-preparation-save-container">
      <h3 className="cleaners-quote-list-preparation-save-title">자주 쓰는 견적서 양식</h3>

      <div className="cleaners-quote-list-preparation-wrapper">
        <div className="cleaners-quote-list-preparation-quote-list-filter-dropdown">
          <Select
          value={selectedOption}
          onChange={handleSelectChange}
          options={options}
          // 👇 이전 답변에서 제시한, JSX 렌더링을 위한 핵심 속성
          formatOptionLabel={(option) => option.label} 
          className="cleaners-quote-list-preparation-quote-list-select-container" // 스타일링을 위한 클래스
          classNamePrefix="cleaners-select" // react-select 내부 요소 스타일링을 위한 prefix
        />
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
