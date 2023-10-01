import { BsCursorFill, BsHddStackFill, BsStars } from "react-icons/bs";
import SaveInput from "./SaveInput";

export const metadata = { title: "保存帖子 - 洛谷帖子保存站" };

export default function Page() {
  return (
    <>
      <div className="mt-6s px-3 px-md-0 mb-5s">
        <SaveInput />
      </div>
      <div className="mb-5x px-3 px-md-0 py-5">
        <h2 className="mb-4 text-center">新版保存站的优点</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-md-3">
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <BsStars />
            </div>
            <h3 className="fs-2 text-body-emphasis">更赏心悦目的界面</h3>
            <p>
              相比于旧版丑陋不堪的皮囊，我们邀请平面设计大师田所浩二（Kouji
              Tadokoro）参与了完整的研发。按照他的理念，我们的设计采用了全新的「灵动」概念，这将是前所未有的。
            </p>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <BsHddStackFill />
            </div>
            <h3 className="fs-2 text-body-emphasis">更稳定的爬取器</h3>
            <p>
              为了面对忽高忽低的用户访问频率，一种可以稳定的、自动重试的爬取架构迫在眉急。通过我们的不懈努力，在长期的研究后，我们如愿以偿地设计出了如今的智能爬取器。
            </p>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <BsCursorFill />
            </div>
            <h3 className="fs-2 text-body-emphasis">更方便的体验</h3>
            <p>
              我们一直致力于提升用户在各方面的体验，因此我们分析了旧版用户的使用习惯，在整理了超过
              120,000
              份报告后，我们最终成功地权衡了不同用户的使用偏好，并进行了专业的交互设计。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
