import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { Button, List } from "@mui/material";
import {
  BUTTON_SIZE_MEDIUM,
  BUTTON_VARIANT_CONTAINED,
  CLEAR_VALUE,
  LOADING_STATUS_TEXT,
  MAX_NEWS_COUNT,
  news_list_sx,
  newsItemUrl,
  topStoriesUrl,
  UPDATE_INTERVAL_TIME,
} from "./NewsPage.constants";

import { NewsDataType, NewsIdTypes, NewsType } from "./NewsPage.types";
import News from "./components/News/News";

import classNames from "classnames/bind";
import styles from "./NewsPage.module.scss";

export default function NewsPage() {
  const [news, setNews] = useState<[] | NewsType[]>([]);
  const [loading, setLoading] = useState<true | false>(false);

  const cx = classNames.bind(styles);

  const fetchNews = async () => {
    setLoading(true);
    setNews(CLEAR_VALUE);

    try {
      const newsIdData: NewsIdTypes = await axios.get(topStoriesUrl);

      newsIdData.data.slice(0, MAX_NEWS_COUNT).map(async (newsID: number) => {
        const newsFetchUrl = `${newsItemUrl}${newsID}.json`;

        const newsData: NewsDataType = await axios.get(newsFetchUrl);

        const { data } = newsData;
        data.time = new Date(Number(data.time));

        setNews((prevState: [] | NewsType[]) => {
          const found = prevState.find((el) => el.id === data.id);

          if (!found) {
            return [...prevState, data].sort((a, b) => {
              return new Date(a.time).getTime() - new Date(b.time).getTime();
            });
          }

          return prevState;
        });
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const getNews = useCallback(() => {
    fetchNews().catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    getNews();
  }, [getNews]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      getNews();
      return () => clearInterval(updateInterval);
    }, UPDATE_INTERVAL_TIME);
  }, [getNews]);

  return (
    <section className={cx(styles.list)}>
      <h3>News</h3>
      <Button
        onClick={getNews}
        variant={BUTTON_VARIANT_CONTAINED}
        size={BUTTON_SIZE_MEDIUM}
      >
        Update News
      </Button>
      {news && !loading ? (
        <List sx={news_list_sx}>
          {news.map((newsData: NewsType) => (
            <News newsData={newsData} key={newsData.id} />
          ))}
        </List>
      ) : (
        <h1>{LOADING_STATUS_TEXT}</h1>
      )}
    </section>
  );
}
