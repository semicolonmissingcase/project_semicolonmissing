
import React, { useState } from 'react';
// import Select from 'react-select';
import './CleanersQuoteListPreparation.css';

function CleanersQuoteListPreparation () {

  const options = [
  { value: 'request_date_desc', label: '최신 요청순' },
  { value: 'quote_list_date_desc', label: '최신 견적순' },
  { value: 'customer_name_desc', label: '이름순 ↓' },
  { value: 'customer_name_asc', label: '이름순 ↑' },
  { value: 'price_desc', label: '견적금액 ↓' },
  { value: 'price_asc', label: '견적금액 ↑' }
  ]

  const [filter, setFilter] = useState(options[0].value);

  function handleFilterChange(e) {
    setFilter(e.target.value);
  }

  return (

    <>

    <h3>OOO 기사님의 견적서</h3>

    <div className="cleaners-quote-list-preparation-save-wrapper">

      <div className="cleaners-quote-list-preparation-quote-list--filter-dropdown"  >
        <select
          value={filter} // React에서 <select>에 초기값을 설정하는 방법
          onChange={handleFilterChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button className="cleaners-quote-list--preparation-quote-list-template-button">자주 쓰는 견적서</button>
      <div className="cleaners-quote-list--preparation-quote-list-saves">
        견적서

        {/* <div className= {`cleaners-quote-list--preparation-quote-list--save-${idx}`}> */}


        {/* </div> */}

      </div>
        
    </div>

    </>

  )
}

export default CleanersQuoteListPreparation;