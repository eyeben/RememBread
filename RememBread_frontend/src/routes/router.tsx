import { useEffect, useState } from "react";
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
import IndexCardViewPage from "@/pages/indexCardView/CardViewPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import CardDetailPage from "@/pages/indexCardView/CardDetailPage";
import CardStudyPage from "@/pages/indexCardView/CardStudyPage";
import CardTTSPage from "@/pages/indexCardView/CardTTSPage";
import CardTestPage from "@/pages/indexCardView/CardTestPage";
import SocialCallbackPage from "@/pages/login/SocialCallbackPage";
import { tokenUtils } from "@/lib/queryClient";
import CardTestBlank from "@/components/indexCardView/CardTestBlank";
import CardTestConcept from "@/components/indexCardView/CardTestConcept";

// 보호된 라우트 Wrapper
const ProtectedOutlet = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [redirectPath] = useState<string>("/login");

  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = tokenUtils.getToken();

      // 토큰이 없는 경우 바로 로그인 페이지로 리다이렉트
      if (!currentToken) {
        setShouldRedirect(true);
        setIsLoading(false);
        return;
      }

      // 토큰이 있는 경우에만 재발급 시도
      const isRefreshed = await tokenUtils.tryRefreshToken();

      if (!isRefreshed) {
        tokenUtils.removeToken();
        setShouldRedirect(true);
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

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
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
    element: <Layout />,
    children: [
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
              {
                path: "my",
                element: <IndexCardViewPage />,
              },
              {
                path: ":indexCardId",
                element: <CardDetailPage />,
                children: [
                  {
                    path: "study",
                    element: <CardStudyPage />,
                  },
                  {
                    path: "tts",
                    element: <CardTTSPage />,
                  },
                  {
                    path: "test",
                    element: <CardTestPage />,
                    children: [
                      { path: "blank", element: <CardTestBlank /> },
                      { path: "concept", element: <CardTestConcept /> },
                    ],
                  },
                ],
              },
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
    ],
  },
]);

export default router;
