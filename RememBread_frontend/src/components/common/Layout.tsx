import { Outlet, useMatches } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/toaster";

interface RouteHandle {
  header?: boolean;
  footer?: boolean;
}

const Layout = () => {
  const routeMatch = useMatches().find((match) => match.handle);
  const layoutConfig: RouteHandle = routeMatch?.handle || {};
  const headerComponent = layoutConfig.header ?? true ? <Header /> : null;
  const footerComponent = layoutConfig.footer ?? true ? <Footer /> : null;

  return (
    <>
      <Toaster />
      <div className="flex flex-col min-w-[300px] w-full max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-neutral-200">
        {headerComponent}
        <main
          className={`flex flex-col flex-1 ${headerComponent ? "pt-[calc(env(safe-area-inset-top)+56px)]" : ""} ${
            footerComponent ? "pb-[calc(env(safe-area-inset-bottom)+70px)]" : ""
          }`}
        >
          <Outlet />
        </main>

        {footerComponent}
      </div>
    </>
  );
};

export default Layout;
