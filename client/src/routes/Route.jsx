import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ProtectedRouter from "./ProtectedRouter.jsx";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import QnaPostShow from "../components/posts/QnaPostShow.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import Result from "../components/result/Result.jsx";
import SocialLoginInfo from "../components/auth/SocialLoginInfo.jsx"; // 카카오 회원가입 후 가는 유저타입선택 페이지
// 기사님 관련
import CleanersRegistration from "../components/cleaners/CleanersRegistration.jsx";
import CleanersAccountEdit from "../components/cleaners/CleanersAccountEdit.jsx";
import CleanersAccountSave from "../components/cleaners/CleanersAccountSave.jsx";
import CleanersInfoEdit from "../components/cleaners/CleanersInfoEdit.jsx";
import CleanersProfileEdit from "../components/cleaners/CleanersProfileEdit.jsx";
import CleanersMyPage from "../components/cleaners/mypage/CleanersMyPage.jsx";
import CleanersQuotationsPreparationSave from "../components/cleaners/CleanersQuotationsPreparationSave.jsx";
import CleanersUserQuotationsShow from "../components/cleaners/CleanersUserQuotationsShow.jsx";
import CleanersUserQuotations from "../components/cleaners/CleanersUserQuotations.jsx";
import ReservationDetail from "../components/cleaners/mypage/ReservationDetail.jsx";

// 점주님 관련
import OwnerRegistration from "../components/owner/users/OwnerRegistration.jsx";
import OwnerMyPage from "../components/owner/mypage/OwnerMyPage.jsx";
import OwnerInfo from "../components/owner/users/OwnerInfo.jsx";
import OwnerReservation from "../components/owner/OwnerReservation.jsx";
import OwnerReservationShow from "../components/owner/OwnerReservationShow.jsx";
// 관리자 관련
import AdminLayout from "../components/admin/common/AdminLayout.jsx";
import AdminMain from "../components/admin/main/AdminMain.jsx";
import AdminLogin from "../components/admin/auth/AdminLogin.jsx";
import AdminCleanerProfile from "../components/admin/pages/cleaners/AdminCleanerProfile.jsx";
import AdminQna from "../components/admin/pages/AdminQna.jsx"
// 채팅 관련 import
import ChatMain from "../components/chat/ChatMain.jsx";
import ChatList from "../components/chat/chatList.jsx";
// 결제 관련 
import PaymentSuccess from "../components/payment/paymentSuccess.jsx";
import PaymentFail from "../components/payment/paymentFail.jsx";



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/socialinfo',
        element: <SocialLoginInfo />
      },
      {
        path: '/registration',
        element: <Outlet />,
        children: [
          {
            // 회원가입 선택 페이지
            path: '',
            element: <Registration />
          },
          {
            // 점주 회원가입 페이지
            path: 'owners',
            element: <OwnerRegistration />,
          },
           {
            // 기사 회원가입 페이지
            path: 'cleaners',
            element: <CleanersRegistration />
           },
        ]
      },
      {
        path: '/cleaners',
        element: <Outlet />,
        children: [
           {
            // 기사 계좌 수정 페이지
            path: 'accountedit/:id',
            element: <CleanersAccountEdit />
          },
          {
            // 기사 계좌 저장 페이지
            path: 'accountsave',
            element: <CleanersAccountSave />,
          },
          {
            // 기사 정보 수정 페이지
            path: 'infoedit',
            element: <CleanersInfoEdit />
          },
          {
            // 기사 프로필 수정 페이지
            path: 'profileedit',
            element: <CleanersProfileEdit />,
          },
          { 
            // 기사 마이 페이지
            path: 'mypage',
            element: <CleanersMyPage />,
          },
          {
            path: 'mypage/job/:id', 
            element: <ReservationDetail />,
          },
          {
            // 기사 견적 작성 임시저장 페이지
            path: 'quotationspreparationsave',
            element: <CleanersQuotationsPreparationSave />,
          },
          {
            // 유저 견적 작성 페이지
            path: 'quotations',
            element: <CleanersUserQuotations />,
          },
          {
            // 유저 견적 작성 페이지 상세
            path: 'quotations/:id',
            element: <CleanersUserQuotationsShow />,
          },
        ]
      },
      {
        path: '/owners',
        element: <Outlet />,
        children: [
          {
            // 점주 마이페이지
            path: 'mypage',
            element: <OwnerMyPage />
          },
          {
            // 점주 정보 수정페이지
            path: 'info',
            element: <OwnerInfo />
          },
          {
            // 점주 견적 요청서 작성 페이지
            path: 'reservation',
            element: <OwnerReservation />,
          },
          {
            // 점주가 확인하는 요청서 페이지
            path: 'reservation/:id',
            element: <OwnerReservationShow />
          }
        ]
      },
      {
        path: '/qnaposts',
        element: <Outlet />,
        children: [
          {
            // 문의게시판
            path: '',
            element: <QnaPost />
          },
          {
            // 글작성 페이지
            path: 'create',
            element: <PostCreate />
          },
          {
            // 게시글 확인 페이지
            path: 'show/:id',
            element: <QnaPostShow />
          }
        ]
      },
      // -------------------------------------
      // 결제 관련 라우트 추가 (ProtectedRouter)
      // -------------------------------------
      {
        element: <ProtectedRouter />,
        children: [
          {
            path: '/payment',
            element: <Outlet />,
            children: [
              {
                path: 'success',
                element: <PaymentSuccess />
              },
              {
                path: 'fail',
                element: <PaymentFail />
              }
            ]
          },      
        ]
      },
      // -----------------------------------------------------
      // 채팅 관련 라우트(기사, 점주만 이용 가능 / ProtectedRouter)
      // -----------------------------------------------------
      {
        element: <ProtectedRouter />,
        children: [
          {
            path: '/chatroom/:id',
            element: <ChatMain />
          },
          {
            path: '/chatlist',
            element: <ChatList />
          },
        ]
      },
      {
        // 결과 페이지(ex. 문의가 등록되었습니다!)
        path: '/result',
        element: <Result />
      },
      // -------------------------------------
      // 관리자 페이지 (ProtectedRouter)
      // -------------------------------------
      {
        element: <ProtectedRouter />,
        children: [
          {
            path: '/hospital',
            children: [
              // ----------------
              // AdminLayout 필요 자식들
              // ----------------
              {
                path: '',
                element: <AdminLayout />,
                children: [
                  {
                    // 통합모니터링
                    path: '',
                    element: <AdminMain />
                  },
                  {
                    // 기사 프로필 관리 페이지
                    path: 'cleanerprofile',
                    element: <AdminCleanerProfile />
                  },
                  {
                    // 문의 관리 페이지
                    path: 'qna',
                    element: <AdminQna />
                  },
                  {
                    // 기사 프로필 관리 페이지
                    path: 'cleaners/profiles',
                    element: <AdminCleanerProfile />
                  },
                ],
              },
              // ----------------
              //  AdminLayout 불필요 자식들
              // ----------------
              {
                // 관리자 로그인
                path: 'login',
                element: <AdminLogin />
              },
            ]
          }
        ]
      },
    ]
  }]
);

export default function Router() {
  return <RouterProvider router={router} />;
}