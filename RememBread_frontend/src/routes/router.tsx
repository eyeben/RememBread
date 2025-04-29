import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import CreateFromPDFPage from "@/pages/createIndexCard/CreateFromPDFPage";
import CreateFromSelfFPage from "@/pages/createIndexCard/CreateFromSelfPage";
import CreateFromTextFPage from "@/pages/createIndexCard/CreateFromTextPage";
import CreateFromImageFPage from "@/pages/createIndexCard/CreateFromImagePage";
import SaveCardPage from "@/pages/createIndexCard/SaveCardPage";
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
        children: [
          { index: true, element: <CreateFromSelfFPage /> },
          { path: "pdf", element: <CreateFromPDFPage /> },
          { path: "text", element: <CreateFromTextFPage /> },
          { path: "image", element: <CreateFromImageFPage /> },
        ],
      },
      {
        path: "save",
        element: <SaveCardPage />,
      },
      {
        path: "card-view",
        children: [{ path: "my", element: <IndexCardViewPage /> }],
      },
    ],
  },
]);

export default router;
