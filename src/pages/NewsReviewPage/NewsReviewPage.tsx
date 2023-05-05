import { useParams } from "react-router-dom";
import { NewsDataType, NewsType } from "../NewsPage/NewsPage.types";
import axios from "axios";
import { newsItemUrl } from "../NewsPage/NewsPage.constants";
import { useEffect, useState } from "react";
import { MyComment } from "./Components/Comment";

export function NewsReviewPage() {
  const [news, setNews] = useState<NewsType | undefined>(undefined);

  const { newsId } = useParams();

  const fetchData = async () => {
    try {
      const newsData: NewsDataType = await axios.get(
        `${newsItemUrl}${newsId}.json`
      );

      const { data } = newsData;

      if (data) {
        setNews(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return news ? (
    <section>
      <h1>{news.title}</h1>
      <h1>{news.by}</h1>
      <h1>{news.url}</h1>
      <h1>{news.kids}</h1>

      {news.kids.map((commentID: number) => {
        return <MyComment commentID={commentID} />;
      })}
    </section>
  ) : (
    <> "Loading..."</>
  );
}
