import "@/components/markdown.css";
import getCounterData from "./get-counter-data";
import Counter from "./Counter";

export const dynamic = "force-dynamic";

export const metadata = { title: "关于 - 洛谷帖子保存站" };

export default async function Page() {
  return (
    <div className="pt-5 pb-3 pb-md-3x px-2 px-md-0">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
          <div className="rounded-4 shadow p-3 p-md-3x">
            <h2 className="mb-4 text-center">关于</h2>
            <div className="markdown">
              <p>你好，这里是由 Piterator 打造的新一代洛谷讨论保存站。</p>
              <p>为了她，我们着实可以说是倾注了不少心血。</p>
              <p>
                毕竟作为完美主义者，我们可不会在早已破败不堪的旧版本上再修修补补。
              </p>
              <p>
                于是，我们先是分析了用户名的需求，并且从头开始设计了智能的爬取器，然后是
                UI
                风格设计，着是各项功能的具体实现，以及最后，当然是宣发（如果你能看到这段话，就说明我们的正式已经宣发了）。
              </p>
              <p>
                不瞒大家说，我们极力推荐依然习惯使用旧版保存站（或是其镜像站）的用户使用你现在看到的新版本，必然是由我们对于自己所研发的产品的自信心作为坚实后盾的。
              </p>
              <p>简而言之，我们自认为新版本的优点有如下 6 项：</p>
              <ol>
                <li>全新 UI：悦目者方可赏心。</li>
                <li>全新爬取逻辑：不书断代之史。</li>
                <li>陶片放逐保存：谪迁常伴于权力之更变。</li>
                <li>用户黑历史：稚嫩之言乃人之常有。</li>
                <li>历史版本快照：我们是正义史官！</li>
                <li>回复推断：无主的回复亦可不再突兀。</li>
              </ol>
              <p>
                不过除此之外，私以为的优点还有不少，不过都是些没什么值得炫耀的小东西罢了。
              </p>
              <p>
                当然，我们总些值得记住的东西，而对于我们开发组而言，我们所引以为傲的是：
              </p>
              <blockquote>
                <p>
                  截至目前，lglg.top{" "}
                  <Counter
                    fallbackData={await getCounterData()}
                    refreshInterval={1000}
                  />
                </p>
              </blockquote>
              <p className="text-end">
                Piterator <br />
                2023 年 6 月 11 日，凌晨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
