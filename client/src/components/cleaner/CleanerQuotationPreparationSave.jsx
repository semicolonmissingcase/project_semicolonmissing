
import './CleanerQuotationPreparation.css';

function CleanerQuotationPreparation () {

  // const [dropDownFilter, setDropDownFilter] = useState(false);

  // const dropDownFilterMenu = () => {

  //   setDropDownFilter(!dropDownFilter)

  // };

  return (
    <>

    <h3>OOO 기사님의 견적서</h3>

    <div calssName="Cleaner-quotation-preparation-save-wrapper">

      {/* <div className="Cleaner-quotation-preparation-quotation-filter-dropdown">
        <img src={`!dropDownFilter ? "/icons/toggle_down.png" : "/icons/toggle_up.png" `} alt="필터 드롭다운 메뉴" onClick={dropDownFilterMenu} />
        <span className="Cleaner-quotation-preparation-quotation-filter-name">최신순</span>
        <span className="Cleaner-quotation-preparation-quotation-filter-name">이름순</span>
        <span className="Cleaner-quotation-preparation-quotation-filter-name">최신순</span>
        <span className="Cleaner-quotation-preparation-quotation-filter-name">최신순</span>
      </div> */}

      <button className="Cleaner-quotation-preparation-quotation-template-button">자주 쓰는 견적서</button>
      <div className="Cleaner-quotation-preparation-quotation-saves">
        견적서

        {/* <div className= {`Cleaner-quotation-preparation-quotation-save-${idx}`}> */}


        {/* </div> */}

      </div>
        
    </div>

    </>
  )
}

export default CleanerQuotationPreparation;