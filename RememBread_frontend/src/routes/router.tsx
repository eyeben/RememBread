import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import CreateFromPDF from "@/pages/createIndexCard/CreateFromPDF";
import IndexCardViewPage from "@/pages/IndexCardViewPage";

const router = createBrowserRouter([
  // 비회원 접근 가능 구간
  {
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        handle: { header: false, footer: false },
      },
    ],
  },

  // 로그인 필요 구간
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { header: true, footer: true },
      },
      {
        path: "create",
        children: [{ path: "pdf", element: <CreateFromPDF /> }],
      },
      {
        path: "card-view",
        children: [{ path: "my", element: <IndexCardViewPage /> }],
      },
    ],
  },
]);

export default router;
