import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { NewsDataType, NewsType } from "../NewsPage/NewsPage.types";
import { newsItemUrl } from "../NewsPage/NewsPage.constants";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Button, Link, Typography } from "@mui/material";
import styles from "./NewsReviewPage.module.scss";

import {
  BACK_BUTTON_TEXT,
  BUTTON_SIZE_MEDIUM,
  BUTTON_VARIANT_CONTAINED,
  INDEX_PAGE_URL,
  LINK_UNDERLINE,
  REFRESH_STATUS_TEXT,
  VARIANT_H1,
  VARIANT_H3,
  VARIANT_H4,
} from "./NewsReviewPage.constants";

import UserComment from "./Components/UserComment";
import { Header } from "semantic-ui-react";

export default function NewsReviewPage() {
  const [news, setNews] = useState<NewsType | undefined>(undefined);
  const [commentsLoading, setCommentsLoading] = useState<true | false>(false);

  const navigate = useNavigate();
  const { newsId } = useParams();

  const cx = classNames.bind(styles);

  const fetchData = async () => {
    setCommentsLoading(true);
    try {
      const newsData: NewsDataType = await axios.get(
        `${newsItemUrl}${newsId}.json`
      );

      const { data } = newsData;

      data.time = new Date(Number(data.time) * 1000);

      if (data) {
        setNews(data);
        setCommentsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getData = useCallback(fetchData, [newsId]);

  const updateCommentsHandler = () => {
    void fetchData();
  };

  const goBack = () => {
    navigate(INDEX_PAGE_URL);
  };

  useEffect(() => {
    void getData();
  }, [getData]);

  return news ? (
    <section className={cx(styles.newsPageCnt)}>
      <Button
        className={cx(styles.backButton)}
        variant={BUTTON_VARIANT_CONTAINED}
        onClick={goBack}
        size={BUTTON_SIZE_MEDIUM}
      >
        {BACK_BUTTON_TEXT}
      </Button>
      <div>
        <Typography
          className={cx(styles.title)}
          variant={VARIANT_H1}
          component={VARIANT_H1}
        >
          {news.title}
        </Typography>
        <Typography variant={VARIANT_H3} component={VARIANT_H3}>
          by: {news.by}
        </Typography>
        <Link
          className={cx(styles.myNlink)}
          href={news.url}
          underline={LINK_UNDERLINE}
        >
          {news.url}
        </Link>
        <Typography variant={VARIANT_H4} component={VARIANT_H4}>
          date: {news.time.toLocaleString()}
        </Typography>

        <Header as={VARIANT_H4} dividing>
          Comments {news?.kids?.length && news.kids.length}
        </Header>
        <Button
          onClick={updateCommentsHandler}
          variant={BUTTON_VARIANT_CONTAINED}
          size={BUTTON_SIZE_MEDIUM}
        >
          Update comments
        </Button>
        {!commentsLoading ? (
          news?.kids?.length &&
          news.kids.map((commentID: number) => {
            return <UserComment key={commentID + 1} commentID={commentID} />;
          })
        ) : (
          <h1>{REFRESH_STATUS_TEXT}</h1>
        )}
      </div>
    </section>
  ) : null;
}
