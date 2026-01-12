import { useEffect } from "react";

// kakao 우편번호 검색 api입니다
export default function useDaumPostcode() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const openPostcode = (onComplete) => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        onComplete(addr, data);
      }
    }).open();
  };

  return { openPostcode };
}