import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import OwnerLogin from "../owner/auth/OwnerLogin.jsx";
import CleanerAccountEdit from "../components/cleaners/CleanerAccountEdit.jsx";
import CleanerInfoEdit from "../components/cleaners/CleanerInfoEdit.jsx";
import CleanerQuoteListPreparation from "../components/cleaners/CleanerQuoteListPreparation.jsx";
import CleanerQuoteListPreparationSave from "../components/cleaners/CleanerQuoteListPreparationSave.jsx";
import CleanerMyPageM from "../components/cleaners/CleanerMyPageM.jsx";
import CleanerMyPageD from "../components/cleaners/CleanerMyPageD.jsx";
import UserQuoteList from "../components/cleaners/UserQuoteList.jsx";

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
            path: 'owner',
            element: <OwnerLogin />,
          },
        ]
      },
        ]
      },
      {
        path: '/cleaners',
        element: <Outlet />,
        children: [
          {
            // 문의게시판
            path: '',
            element: <QnaPost />
          },
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
            path: 'mypagem',
            element: <CleanerMyPageM />,
          },
          {
            path: 'mypaged',
            element: <CleanerMyPageD />,
          },
          {
            path: 'userquotelist',
            element: <UserQuoteList />,
          }
        ]
      },
    ]
);

export default function Router() {
  return <RouterProvider router={router} />;
}