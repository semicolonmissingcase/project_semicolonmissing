import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "../App";
import Main from "../components/main/Main.jsx";
import QnaPost from "../components/posts/QnaPost.jsx";
import PostCreate from "../components/posts/PostCreate.jsx";
import Login from "../components/auth/Login.jsx";
import Registration from "../components/users/Registration.jsx";
import OwnerLogin from "../owner/auth/OwnerLogin.jsx";
import EngineerInfoEdit from "../components/engineer/EngineerInfoEdit.jsx";
import EngineerAccountEdit from "../components/engineer/EngineerAccountEdit.jsx";

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
        path: '/engineer',
        element: <Outlet />,
        children: [
          {
            // 문의게시판
            path: '',
            element: <QnaPost />
          },
          {
            path: 'engineeraccountedit',
            element: <EngineerAccountEdit />
          },
          {
            path: 'engineerinfoedit',
            element: <EngineerInfoEdit />
          },
        ]
      },
    ]
);

export default function Router() {
  return <RouterProvider router={router} />;
}