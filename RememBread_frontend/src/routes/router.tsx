import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/common/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import GamesPage from "@/pages/GamesPage";
import MapPage from "@/pages/MapPage";
import SignupTermsPage from "@/pages/login/SignupTermsPage";
import TermDetailPage from "@/pages/login/TermDetailPage";
import CreateFromPDFPage from "@/pages/createIndexCard/CreateFromPDFPage";
import CreateFromSelfPage from "@/pages/createIndexCard/CreateFromSelfPage";
import CreateFromTextFPage from "@/pages/createIndexCard/CreateFromTextPage";
import CreateFromImageFPage from "@/pages/createIndexCard/CreateFromImagePage";
import SaveCardPage from "@/pages/createIndexCard/SaveCardPage";
import IndexCardViewPage from "@/pages/IndexCardViewPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SocialCallbackPage from "@/pages/login/SocialCallbackPage";
import useAuthStore from '@/stores/authStore';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuthStore();
  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
};

// 로그인 라우트 컴포넌트
const LoginRoute = () => {
  const { accessToken } = useAuthStore();
  return accessToken ? <Navigate to="/index-card/my" replace /> : <LoginPage />;
};

const router = createBrowserRouter([
  // 비회원 접근 가능 구간
  {
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <LoginRoute />,
        handle: { header: false, footer: false },
      },
      {
        path: "/account/login/:socialType",
        element: <SocialCallbackPage />,
        handle: { header: false, footer: false },
      },
      {
        path: "/signup/terms",
        element: <SignupTermsPage />,
        handle: { header: false, footer: false },
        children: [
          {
            path: ":termId",
            element: <TermDetailPage />,
            handle: { header: false, footer: false },
          },
        ],
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
        element: <ProtectedRoute><HomePage /></ProtectedRoute>,
        handle: { header: true, footer: true },
      },
      {
        path: "create",
        children: [
          { index: true, element: <ProtectedRoute><CreateFromSelfPage /></ProtectedRoute> },
          { path: "pdf", element: <ProtectedRoute><CreateFromPDFPage /></ProtectedRoute> },
          { path: "text", element: <ProtectedRoute><CreateFromTextFPage /></ProtectedRoute> },
          { path: "image", element: <ProtectedRoute><CreateFromImageFPage /></ProtectedRoute> },
        ],
      },
      {
        path: "save",
        element: <ProtectedRoute><SaveCardPage /></ProtectedRoute>,
      },
      {
        path: "card-view",
        children: [{ path: "my", element: <ProtectedRoute><IndexCardViewPage /></ProtectedRoute> }],
      },
      {
        path: "profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "/games",
        element: <ProtectedRoute><GamesPage /></ProtectedRoute>,
      },
      {
        path: "/map",
        element: <ProtectedRoute><MapPage /></ProtectedRoute>,
      },
    ],
  },
]);

export default router;
