import "./globals.scss";
import "./bootstrap.scss";
import { Suspense } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import GoogleAnalytics from "./GoogleAnalytics";
import MicrosoftClarity from "./MicrosoftClarity";

export const metadata = {
  title: "洛谷帖子保存站",
  description: "洛谷管理员总是删帖？吃瓜群众这边儿请！",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh-Hans-CN">
      <body>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <Suspense>
            <GoogleAnalytics
              measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            />
          </Suspense>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <MicrosoftClarity
            projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
          />
        )}
        <NavBar />
        <div className="container-lg" style={{ marginTop: "2rem" }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
