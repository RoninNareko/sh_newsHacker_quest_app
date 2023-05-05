import {
  CommentDataType,
  CommentPropsTypes,
  CommentType,
} from "./Comment.types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { newsItemUrl } from "../../NewsPage/NewsPage.constants";
import { Button, Comment } from "semantic-ui-react";
import { MoreComent } from "./Components/MoreComent";

export function MyComment({ commentID }: CommentPropsTypes) {
  const [comment, setComment] = useState<CommentType | undefined>(undefined);
  const [moreComments, setMoreComments] = useState<CommentType[] | []>([]);

  const getComments = async (commentID: number) => {
    try {
      const newsFetchUrl = `${newsItemUrl}${commentID}.json`;
      const commentData: CommentDataType = await axios.get(newsFetchUrl);
      const { data } = commentData;
      setComment(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    void getComments(commentID);
  }, [commentID]);

  const LoadMoreComments = async () => {
    try {
      comment?.kids?.map(async (commentID: number) => {
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
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
          <Comment.Content>
            <Comment.Author as="a">{comment?.by}</Comment.Author>
            <Comment.Metadata>
              <div>{comment?.time}</div>
            </Comment.Metadata>
            <Comment.Text>
              <p>{comment?.text}</p>
            </Comment.Text>
            <Comment.Actions>
              {comment?.kids && (
                <Comment.Action>
                  <Button onClick={LoadMoreComments}>
                    {!moreComments.length
                      ? `   Show answers (${comment?.kids.length})`
                      : "Hide"}
                  </Button>
                </Comment.Action>
              )}
            </Comment.Actions>
          </Comment.Content>
          {moreComments.map((moreComent: CommentType) => {
            return <MoreComent key={moreComent.id} moreComent={moreComent} />;
          })}
        </Comment>
      </Comment.Group>
    </>
  );
}
