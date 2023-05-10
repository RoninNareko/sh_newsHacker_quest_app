import * as React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { NewsPropsTypes } from "./News.types";
import { Link } from "react-router-dom";

export default function News({
  newsData: { id, score, by, time, kids, title },
}: NewsPropsTypes) {
  const secondary = (
    <p>
      <b>{score}</b> points <b>by</b> {by}
      <b> {time.toLocaleString()}, </b>
      {kids?.length + 1 || 0} <b>comments</b>
    </p>
  );

  const primary = (
    <p>
      <b>#{id}</b> {title}
    </p>
  );

  return (
    <ListItem>
      <Link to={`/${id}`}>
        <ListItemText primary={primary} secondary={secondary} />
      </Link>
    </ListItem>
  );
}
