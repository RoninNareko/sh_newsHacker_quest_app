import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CommentDataType,
  CommentPropsTypes,
  CommentType,
} from "./UserComment.types";

import { newsItemUrl } from "../../NewsPage/NewsPage.constants";
import { Button, Comment } from "semantic-ui-react";
import {
  CLEAR_VALUE,
  COMMENT_IMAGE_URL,
  HIDE_COMMENT_BUTTON_TEXT,
} from "./UserComment.constants";

export default function UserComment({
  commentID,
  moreComment,
}: CommentPropsTypes) {
  const [comment, setComment] = useState<CommentType | undefined>(undefined);
  const [moreComments, setMoreComments] = useState<CommentType[] | []>([]);
  const [showMoreComments, setShowMoreComments] = useState<true | false>(false);

  const getComment = async (commentID: number) => {
    try {
      const newsFetchUrl = `${newsItemUrl}${commentID}.json`;
      const commentData: CommentDataType = await axios.get(newsFetchUrl);

      const { data } = commentData;
      data.time = new Date(Number(data.time) * 1000);

      setComment(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (commentID) {
      void getComment(commentID);
    }
  }, [commentID]);

  const setComments = async (commentID: number) => {
    const moreCommentsFetchUrl = `${newsItemUrl}${commentID}.json`;
    const commentData: CommentDataType = await axios.get(moreCommentsFetchUrl);

    const { data } = commentData;

    setMoreComments((prevState: [] | CommentType[]) => {
      const newComments = [...prevState, data];

      newComments.forEach((coment) => {
        return (coment.time = new Date(Number(coment.time) * 1000));
      });

      return newComments;
    });
  };

  const LoadMoreComments = async (more: boolean) => {
    setMoreComments(CLEAR_VALUE);
    setShowMoreComments(!showMoreComments);

    try {
      if (more && !moreComments.length) {
        moreComment?.kids?.map(setComments);
      } else {
        comment?.kids?.map(setComments);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src={COMMENT_IMAGE_URL} />
          <Comment.Content>
            <Comment.Author>{comment?.by}</Comment.Author>
            <Comment.Metadata>
              <div>
                {comment
                  ? comment.time.toLocaleString()
                  : moreComment && moreComment.time.toLocaleString()}
              </div>
            </Comment.Metadata>
            <Comment.Text>
              <p>{comment?.text || moreComment?.text}</p>
            </Comment.Text>
            <Comment.Actions>
              {comment?.kids && (
                <Comment.Action>
                  <Button onClick={() => LoadMoreComments(false)}>
                    {moreComments.length && showMoreComments
                      ? HIDE_COMMENT_BUTTON_TEXT
                      : `Show answers (${comment?.kids.length})`}
                  </Button>
                </Comment.Action>
              )}
              {moreComment?.kids && (
                <Comment.Action>
                  <Button onClick={() => LoadMoreComments(true)}>
                    {moreComments.length && showMoreComments
                      ? HIDE_COMMENT_BUTTON_TEXT
                      : `Show answers (${moreComment?.kids.length})`}
                  </Button>
                </Comment.Action>
              )}
            </Comment.Actions>
          </Comment.Content>
          <section
            style={{
              display: showMoreComments ? "block" : "none",
            }}
          >
            {moreComments.map((moreComment: CommentType) => {
              return (
                <UserComment key={moreComment?.id} moreComment={moreComment} />
              );
            })}
          </section>
        </Comment>
      </Comment.Group>
    </>
  );
}
