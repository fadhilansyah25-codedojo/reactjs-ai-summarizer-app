import React from "react";
import assets from "../assets";

import { useLazyGetSummaryQuery } from "../services/article";

type Article = {
  url: string;
  summary: string;
};

const Demo = () => {
  const [article, setArticle] = React.useState<Article>({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = React.useState<Array<Article>>([]);
  const [copied, setCopied] = React.useState(false);

  // RTK lazy query
  const [getSummary, { isFetching, error }] = useLazyGetSummaryQuery();

  React.useEffect(() => {
    const articles = localStorage.getItem("articles");

    if (articles != null) {
      const articlesFromLocalStorage = JSON.parse(articles);
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleError = () => {
    if (error) {
      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        const errMsg =
          "error" in error
            ? error.error
            : (error.data as unknown as { error: string }).error;

        return `Error code ${error.status}: ${errMsg}`;
      } else {
        // you can access all properties of `SerializedError` here
        return error.message;
      }
    }
  };

  const handleCopy = (copyUrl: string) => {
    navigator.clipboard.writeText(copyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex w-full flex-col gap-2">
        <form
          className="relative flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <img
            src={assets.linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn 
            peer-focus:border-gray-400
            peer-focus:text-gray-700
            "
          >
            ↵
          </button>
        </form>

        {/* Browse URL History*/}
        <div className="flex max-h-60 flex-col gap-1 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <button className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied ? assets.tick : assets.copy}
                  alt="copy_icon"
                  className="h-[60%] w-[60%] object-contain"
                />
              </button>
              <p className="flex-1 truncate font-satoshi text-xs font-medium text-blue-700">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Resutls*/}
      <div className="my-10 flex max-w-full justify-center">
        {isFetching ? (
          <img
            src={assets.loader}
            alt="loader"
            className="h-20 w-20 object-contain"
          />
        ) : error ? (
          <p className="text-center font-inter font-bold text-black">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {handleError()}
            </span>
          </p>
        ) : article.summary ? (
          <div className="flex flex-col gap-3">
            <h2 className="font-satoshi text-xl font-bold text-gray-600">
              Article <span className="blue_gradient">Summary</span>
            </h2>
            <div className="summary_box">
              <p className="font-inter text-sm font-medium text-gray-700">
                {article.summary}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Demo;
