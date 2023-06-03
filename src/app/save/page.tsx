export default function Page() {
  return (
    <div>
      <div
        className="input-group input-group-lg mx-auto my-5x"
        style={{ maxWidth: "40em" }}
      >
        <input
          className="form-control shadow"
          autoComplete="off"
          placeholder="帖子链接或编号"
        />
        <button className="btn btn-success shadow" type="button">
          立即保存
        </button>
      </div>
      <div className="mb-5x px-4 py-5">
        <h2 className="pb-2 border-bottom">新版保存站的优点</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-stars"
                viewBox="0 0 16 16"
              >
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
              </svg>
            </div>
            <h3 className="fs-2 text-body-emphasis">更赏心悦目的界面</h3>
            <p>
              相比于旧版丑陋不堪的皮囊，我们邀请平面设计大师田所浩二（Kouji
              Tadokoro）参与了完整的研发。按照他的理念，我们的设计采用了全新的「灵动」概念，这将是前所未有的。
            </p>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-hdd-stack-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zM2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z" />
              </svg>
            </div>
            <h3 className="fs-2 text-body-emphasis">更稳定的爬取器</h3>
            <p>
              为了面对忽高忽低的用户访问频率，一种可以稳定的、自动重试的爬取架构迫在眉急。通过我们的不懈努力，在长期的研究后，我们如愿以偿地设计出了如今的智能爬取器。
            </p>
          </div>
          <div className="feature col">
            <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                fill="currentColor"
                className="bi bi-cursor-fill"
                viewBox="0 0 16 16"
              >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
              </svg>
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
    </div>
  );
}
