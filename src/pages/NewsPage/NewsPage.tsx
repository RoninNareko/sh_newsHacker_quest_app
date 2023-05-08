import { List } from "@mui/material";
import {
  MAX_NEWS_COUNT,
  news_list_sx,
  newsItemUrl,
  topStoriesUrl,
} from "./NewsPage.constants";

import { useEffect, useState } from "react";

import classNames from "classnames/bind";
import styles from "./NewsPage.module.scss";

import axios from "axios";
import { NewsDataType, NewsIdTypes, NewsType } from "./NewsPage.types";
import News from "./components/News/News";

export default function NewsPage() {
  const cx = classNames.bind(styles);

  const [news, setNews] = useState<[] | NewsType[]>([]);

  const getNews = async () => {
    try {
      const newsIdData: NewsIdTypes = await axios.get(topStoriesUrl);

      newsIdData.data.slice(0, MAX_NEWS_COUNT).map(async (newsID: number) => {
        const newsFetchUrl = `${newsItemUrl}${newsID}.json`;

        const newsData: NewsDataType = await axios.get(newsFetchUrl);

        const { data } = newsData;

        setNews((prevState: [] | NewsType[]) => {
          return [...prevState, data].sort((a, b) => {
            return a.time - b.time;
          });
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void getNews();
  }, []);

  return (
    <section className={cx(styles.list)}>
      <h3>News</h3>
      <List sx={news_list_sx}>
        {news?.map((newsData: NewsType) => (
          <News newsData={newsData} key={newsData.id} />
        ))}
      </List>
    </section>
  );
}
