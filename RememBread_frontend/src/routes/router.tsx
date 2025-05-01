import { useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
import IndexCardViewPage from "@/pages/indexCardView/IndexCardViewPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import CardDetailPage from "@/pages/indexCardView/CardDetailPage";
import SocialCallbackPage from "@/pages/login/SocialCallbackPage";
import { tokenUtils } from '@/lib/queryClient';

// 보호된 라우트 Wrapper
const ProtectedOutlet = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      // accessToken이 없거나 신선하지 않은 경우에만 refresh token으로 갱신 시도
      if (!tokenUtils.getToken()) {
        console.log('accessToken이 없거나 신선하지 않습니다. refresh token으로 갱신을 시도합니다.');
        const isRefreshed = await tokenUtils.tryRefreshToken();
        
        if (!isRefreshed) {
          console.log('refresh token으로도 accessToken을 받아오지 못했습니다. 로그인 페이지로 이동합니다.');
          tokenUtils.removeToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return tokenUtils.getToken() ? <Outlet /> : <Navigate to="/login" replace />;
};

// 로그인 라우트 컴포넌트
const LoginRoute = () => {
  const accessToken = tokenUtils.getToken();
  return accessToken ? <Navigate to="/card-view/my" replace /> : <LoginPage />;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // 비회원 접근 가능
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

  // 로그인 필요 구간 (protected)
  {
    element: <ProtectedOutlet />,
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
        children: [
          { path: "my", element: <IndexCardViewPage /> },
          { path: ":indexCardId", element: <CardDetailPage /> },
        ],
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
