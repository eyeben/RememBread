import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/common/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import GamesPage from "@/pages/GamesPage";
import MapPage from "@/pages/MapPage";
import ProfilePage from "@/pages/ProfilePage";
import CreateFromPDF from "@/pages/createIndexCard/CreateFromPDF";
import CreateFromText from "@/pages/createIndexCard/CreateFromText";
import CreateFromImage from "@/pages/createIndexCard/CreateFromImage";
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
          { path: "pdf", element: <CreateFromPDF /> },
          { path: "text", element: <CreateFromText /> },
          { path: "image", element: <CreateFromImage /> },
        ],
      },
      {
        path: "card-view",
        children: [{ path: "my", element: <IndexCardViewPage /> }],
      },
      {
        path: "/games",
        element: <GamesPage />,
      },
      {
        path: "/map",
        element: <MapPage />,
      },
      {
        path: "/card-view",
        element: <IndexCardViewPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;
