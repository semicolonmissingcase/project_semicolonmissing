import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import Result from "./result/Result.jsx";
// 기사님 관련
import CleanerAccountEdit from "../components/cleaners/CleanerAccountEdit.jsx";
import CleanerInfoEdit from "../components/cleaners/CleanerInfoEdit.jsx";
import CleanerQuoteListPreparation from "../components/cleaners/CleanerQuoteListPreparation.jsx";
import CleanerQuoteListPreparationSave from "../components/cleaners/CleanerQuoteListPreparationSave.jsx";
import CleanerMyPage from "../components/cleaners/CleanerMyPage.jsx";
// 점주님 관련
import OwnerRegistration from "../components/owner/users/OwnerRegistration.jsx";
import OwnerMyPage from "../components/owner/maypage/MyPage.jsx";
import OwnerInfo from "../components/owner/users/OwnerInfo.jsx";
// 관리자 관련
import AdminMain from "../components/admin/main/AdminMain.jsx";
import AdminLogin from "../components/admin/auth/AdminLogin.jsx";
// 채팅 관련 import
import ChatMain from "../components/chat/ChatMain.jsx";
import ChatList from "../components/chat/chatList.jsx";


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
        ]
      },
      {
        path: '/cleaners',
        element: <Outlet />,
        children: [
           {
            path: 'accountedit',
            element: <CleanerAccountEdit />
          },
          {
            path: 'infoedit',
            element: <CleanerInfoEdit />
          },
          {
            path: 'quotelistpreparation',
            element: <CleanerQuoteListPreparation />,
          },
          {
            path: 'quotelistpreparationsave',
            element: <CleanerQuoteListPreparationSave />,
          },
          {
            path: 'mypage',
            element: <CleanerMyPage />,
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
          }
        ]
      },      
      // 채팅 관련 라우트
      {
        path: '/chatroom/:id',
        element: <ChatMain />
      },
      {
        path: '/chatlist',
        element: <ChatList />
      },
      {
        // 결과 페이지(ex. 문의가 등록되었습니다!)
        path: '/result',
        element: <Result />
      },
      {
        // 관리자페이지
        path: '/hospital',
        element: <Outlet />,
        children: [
          {
            // 통합모니터링
            path: '',
            element: <AdminMain />
          },
          {
            // 관리자 로그인
            path: 'login',
            element: <AdminLogin />
          },
        ]
      }
    ]
  }]
);

export default function Router() {
  return <RouterProvider router={router} />;
}