import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "./CleanersTopSummary.css";


export default function CleanersTopSummary({ summary }) {

  const ymd = (d) => (isValid(d) ? format(d, "yyyy-MM-dd") : "");
  const money = (n) => n.toLocaleString("ko-KR"); 

  const navigate = useNavigate();

  return (
    <div className="cleaners-top-summary-wrapper">
      <div className="cleaners-top-summary-title">현재 정산 상태</div>
      <p className="cleaners-top-summary-date">{format(summary.summaryDate, "yyyy년 M월 d일 eeee", { locale: ko })}</p>
      <div className="cleaners-top-summary-amounts">
        <dl className="cleaners-top-summary-amount-item">
          <dt>입금 예정:</dt>
          <dd>{money(summary.scheduledAmount)} 원</dd>
        </dl>
        <dl className="cleaners-top-summary-amount-item">
          <dt>정산 완료:</dt>
          <dd>{money(summary.completedAmount)} 원</dd>
        </dl>
      </div>
      <button className="cleaners-top-summary-account-edit-btn" onClick={() => navigate('/cleaners/accountsave')}>계좌 수정</button>
    </div>
  );
}