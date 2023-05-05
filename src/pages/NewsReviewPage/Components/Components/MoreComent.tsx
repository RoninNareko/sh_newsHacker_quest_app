import { Button, Comment } from "semantic-ui-react";
import React, { useState } from "react";
import { MoreCommentPropsTypes } from "./MoreComent.types";
import { newsItemUrl } from "../../../NewsPage/NewsPage.constants";
import { CommentDataType, CommentType } from "../Comment.types";
import axios from "axios";

export function MoreComent({ moreComent }: MoreCommentPropsTypes) {
  const [moreComments, setMoreComments] = useState<CommentType[] | []>([]);
  const LoadMoreComments = async () => {
    try {
      moreComent?.kids?.map(async (commentID: number) => {
        const moreCommentsFetchUrl = `${newsItemUrl}${commentID}.json`;
        const commentData: CommentDataType = await axios.get(
          moreCommentsFetchUrl
        );
        const { data } = commentData;
        if (!moreComments.length) {
          setMoreComments((prevState: [] | CommentType[]) => {
            return [...prevState, data];
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
        <Comment.Content>
          <Comment.Author as="a">{moreComent.by}</Comment.Author>
          <Comment.Metadata>
            <div>{moreComent.time}</div>
          </Comment.Metadata>
          <Comment.Text>{moreComent.text}</Comment.Text>
          <Comment.Actions>
            {moreComent?.kids && (
              <Comment.Action>
                <Button onClick={LoadMoreComments}>
                  {!moreComments.length
                    ? `   Show answers (${moreComent?.kids.length})`
                    : "Hide"}
                </Button>
              </Comment.Action>
            )}
          </Comment.Actions>
        </Comment.Content>

        {moreComments.map((coment: CommentType) => (
          <MoreComent key={coment.id} moreComent={coment} />
        ))}
      </Comment>
    </Comment.Group>
  );
}
