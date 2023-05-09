import { useNavigate, useParams } from "react-router-dom";
import { NewsDataType, NewsType } from "../NewsPage/NewsPage.types";
import axios from "axios";
import { newsItemUrl } from "../NewsPage/NewsPage.constants";
import { useCallback, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./NewsReviewPage.module.scss";
import { Button, Link, Typography } from "@mui/material";

import {
  BACK_BUTTON_TEXT,
  BUTTON_SIZE_MEDIUM,
  BUTTON_VARIANT_CONTAINED,
  INDEX_PAGE_URL,
  LINK_UNDERLINE,
  LOADING_STATUS_TEXT,
  REFRESH_STATUS_TEXT,
  VARIANT_H1,
  VARIANT_H3,
  VARIANT_H4,
} from "./NewsReviewPage.constants";
import { UserComment } from "./Components/Comment";
import { Header } from "semantic-ui-react";

export function NewsReviewPage() {
  const navigatie = useNavigate();
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
      data.time = new Date(data.time);
      if (data) {
        setNews(data);
        setRefresh(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getData = useCallback(fetchData, [newsId]);
  const updateCommentsHandler = () => {
    setRefresh(true);
    void fetchData();
  };

  const goBack = () => {
    navigatie(INDEX_PAGE_URL);
  };

  useEffect(() => {
    void getData();
  }, [refresh, getData]);

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
        <Typography variant={VARIANT_H1} component={VARIANT_H1}>
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
          date: {news.time.toTimeString()}
        </Typography>

        <Header as={VARIANT_H4} dividing>
          Comments {news?.kids.length && news.kids.length}
        </Header>
        <Button
          onClick={updateCommentsHandler}
          variant={BUTTON_VARIANT_CONTAINED}
          size={BUTTON_SIZE_MEDIUM}
        >
          Update comments
        </Button>
        {!refresh ? (
          news?.kids.length &&
          news.kids.map((commentID: number) => {
            return <UserComment key={commentID + 1} commentID={commentID} />;
          })
        ) : (
          <h1>{REFRESH_STATUS_TEXT}</h1>
        )}
      </div>
    </section>
  ) : (
    <h1>{LOADING_STATUS_TEXT}</h1>
  );
}
