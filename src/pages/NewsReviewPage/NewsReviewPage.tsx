import { useParams } from "react-router-dom";
import { NewsDataType, NewsType } from "../NewsPage/NewsPage.types";
import axios from "axios";
import { newsItemUrl } from "../NewsPage/NewsPage.constants";
import { useEffect, useState } from "react";
import { MyComment } from "./Components/Comment";
import { Header } from "semantic-ui-react";
import classNames from "classnames/bind";
import styles from "./NewsReviewPage.module.scss";
import { Button, Link, Typography } from "@mui/material";
import { mapTime } from "../NewsPage/components/News/News.utils";

export function NewsReviewPage() {
  const [news, setNews] = useState<NewsType | undefined>(undefined);
  const [refresh, setRefresh] = useState<false | true>(false);
  const cx = classNames.bind(styles);
  const { newsId } = useParams();

  const fetchData = async () => {
    try {
      const newsData: NewsDataType = await axios.get(
        `${newsItemUrl}${newsId}.json`
      );

      const { data } = newsData;

      if (data) {
        setNews(data);
        setRefresh(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateCommentsHandler = () => {
    setRefresh(true);
    void fetchData();
  };
  useEffect(() => {
    void fetchData();
  }, [refresh, fetchData]);
  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  return news ? (
    <section className={cx(styles.newsPageCnt)}>
      <Button variant="contained" size="medium">
        {`${"<Back to news"}`}
      </Button>
      <div>
        <Typography variant="h1" component="h1">
          {news.title}
        </Typography>
        <Typography variant="h3" component="h3">
          by: {news.by}
        </Typography>
        <Link className={cx(styles.myNlink)} href="#" underline="always">
          {news.url}
        </Link>
        <Typography variant="h4" component="h4">
          date: {`${mapTime(news.time)} days ago`}
        </Typography>

        <Header as="h3" dividing>
          Comments {news.kids.length}
        </Header>
        <Button
          onClick={updateCommentsHandler}
          variant="contained"
          size="medium"
        >
          Update comments
        </Button>
        {!refresh ? (
          news.kids.map((commentID: number) => {
            return <MyComment key={commentID + 1} commentID={commentID} />;
          })
        ) : (
          <h1>refresh...</h1>
        )}
      </div>
    </section>
  ) : (
    <h1>Loading...</h1>
  );
}
