import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import GamesPage from "@/pages/GamesPage";
import MapPage from "@/pages/MapPage";
import CreateFromPDFPage from "@/pages/createIndexCard/CreateFromPDFPage";
import CreateFromSelfPage from "@/pages/createIndexCard/CreateFromSelfPage";
import CreateFromTextFPage from "@/pages/createIndexCard/CreateFromTextPage";
import CreateFromImageFPage from "@/pages/createIndexCard/CreateFromImagePage";
import SaveCardPage from "@/pages/createIndexCard/SaveCardPage";
import IndexCardViewPage from "@/pages/IndexCardViewPage";
import ProfilePage from "@/pages/profile/ProfilePage";

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
          { index: true, element: <CreateFromSelfPage /> },
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
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "/games",
        element: <GamesPage />,
      },
      {
        path: "/map",
        element: <MapPage />,
      },
    ],
  },
]);

export default router;
