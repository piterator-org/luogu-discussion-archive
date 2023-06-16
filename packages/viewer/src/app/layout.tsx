import "./globals.scss";
import "./bootstrap.scss";
import NavBar from "./NavBar";
import Footer from "./Footer";

export const metadata = {
  title: "洛谷帖子保存站",
  description: "洛谷管理员总是删帖？吃瓜群众这边儿请！",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="zh-Hans-CN">
      <body>
        <NavBar />
        <div className="container-lg" style={{ marginTop: "2rem" }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
