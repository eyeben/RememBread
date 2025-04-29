import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import Layout from "@/components/common/Layout";
import GamesPage from "@/pages/GamesPage";
import MapPage from "@/pages/MapPage";
import CardViewPage from "@/pages/CardViewPage";
import ProfilePage from "@/pages/ProfilePage";

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
        path: "/games",
        element: <GamesPage />,
        handle: { header: true, footer: true },
      },
      {
        path: "/map",
        element: <MapPage />,
        handle: { header: true, footer: true },
      },
      {
        path: "/card-view",
        element: <CardViewPage />,
        handle: { header: true, footer: true },
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        handle: { header: true, footer: true },
      },
    ],
  },
]);

export default router;
