import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import CleanerAccountEdit from "../components/cleaners/CleanerAccountEdit.jsx";
import CleanerInfoEdit from "../components/cleaners/CleanerInfoEdit.jsx";
import CleanerQuoteListPreparation from "../components/cleaners/CleanerQuoteListPreparation.jsx";
import CleanerQuoteListPreparationSave from "../components/cleaners/CleanerQuoteListPreparationSave.jsx";
import CleanerMyPage from "../components/cleaners/CleanerMyPage.jsx";
import OwnerRegistration from "../owner/auth/OwnerRegistration.jsx";
import Result from "./result/Result.jsx";

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