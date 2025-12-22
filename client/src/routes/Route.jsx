import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import Result from "./result/Result.jsx";
// 기사님 관련
import CleanersAccountEdit from "../components/cleaners/CleanersAccountEdit.jsx";
import CleanersAccountSave from "../components/cleaners/CleanersAccountSave.jsx";
import CleanersInfoEdit from "../components/cleaners/CleanersInfoEdit.jsx";
import CleanersProfileEdit from "../components/cleaners/CleanersProfileEdit.jsx";
import CleanersMyPage from "../components/cleaners/CleanersMyPage.jsx";
import CleanersQuoteListPreparation from "../components/cleaners/CleanersQuoteListPreparation.jsx";
import CleanersQuoteListPreparationSave from "../components/cleaners/CleanersQuoteListPreparationSave.jsx";
import CleanersUserQuoteListTitle from "../components/cleaners/CleanersUserQuoteListTitle.jsx";
import CleanersUserQuoteListDetails from "../components/cleaners/CleanersUserQuoteListDetails.jsx";
// 점주님 관련
import OwnerRegistration from "../components/owner/auth/OwnerRegistration.jsx";
import OwnerMyPage from "../components/owner/maypage/MyPage.jsx";
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
        element: <Outlet />,
        children: [
          {
            // 로그인 페이지
            path: '',
            element: <Login />,
          },
        ]
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
            // 계좌 수정 페이지
            path: 'accountedit',
            element: <CleanersAccountEdit />
          },
          {
            // 계좌 저장 페이지
            path: 'accountsave',
            element: <CleanersAccountSave />,
          },
          {
            // 정보 수정 페이지
            path: 'infoedit',
            element: <CleanersInfoEdit />
          },
          {
            // 프로필 수정 페이지
            path: 'profileedit',
            element: <CleanersProfileEdit />,
          },
          { 
            // 마이페이지
            path: 'mypage',
            element: <CleanersMyPage />,
          },
          {
            // 기사 견적 작성 페이지
            path: 'quotelistpreparation',
            element: <CleanersQuoteListPreparation />,
          },
          {
            // 기사 견적 작성 임시저장 페이지
            path: 'quotelistpreparationsave',
            element: <CleanersQuoteListPreparationSave />,
          },
          {
            // 유저 견적 작성 페이지
            path: 'userquotelist',
            element: <CleanersUserQuoteListTitle />,
          },
          {
            // 유저 견적 작성 페이지 상세
            path: 'userquotelistdetails',
            element: <CleanersUserQuoteListDetails />,
          },
        ]
      },
      {
        path: '/owner',
        element: <Outlet />,
        children: [
          {
            path: 'mypage/:id',
          element: <OwnerMyPage />
          },
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
        path: '/result',
        element: <Result />
      },
    ]
  }]
);

export default function Router() {
  return <RouterProvider router={router} />;
}