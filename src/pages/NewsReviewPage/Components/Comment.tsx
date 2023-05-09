import {
  CommentDataType,
  CommentPropsTypes,
  CommentType,
} from "./Comment.types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { newsItemUrl } from "../../NewsPage/NewsPage.constants";
import { Button, Comment } from "semantic-ui-react";
import { HIDE_COMMENT_BUTTON_TEXT } from "./Comment.constants";

export function MyComment({ commentID, moreComent }: CommentPropsTypes) {
  const [comment, setComment] = useState<CommentType | undefined>(undefined);
  const [moreComments, setMoreComments] = useState<CommentType[] | []>([]);
  const [showMoreComments, setShowMoreComments] = useState<true | false>(false);

  const getComment = async (commentID: number) => {
    try {
      const newsFetchUrl = `${newsItemUrl}${commentID}.json`;
      const commentData: CommentDataType = await axios.get(newsFetchUrl);
      const { data } = commentData;
      data.time = new Date(data.time);
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
        return (coment.time = new Date(coment.time));
      });

      newComments.sort((a: CommentType, b: CommentType) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      return newComments;
    });
  };

  const LoadMoreComments = async (more: boolean) => {
    setShowMoreComments(!showMoreComments);
    try {
      if (more && !moreComments.length) {
        moreComent?.kids?.map(setComments);
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
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
          <Comment.Content>
            <Comment.Author as="a">{comment?.by}</Comment.Author>
            <Comment.Metadata>
              <div>
                {comment
                  ? comment.time.toTimeString()
                  : moreComent && moreComent.time.toTimeString()}
              </div>
            </Comment.Metadata>
            <Comment.Text>
              <p>{comment?.text || moreComent?.text}</p>
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
              {moreComent?.kids && (
                <Comment.Action>
                  <Button onClick={() => LoadMoreComments(true)}>
                    {moreComments.length && showMoreComments
                      ? HIDE_COMMENT_BUTTON_TEXT
                      : `Show answers (${moreComent?.kids.length})`}
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
                <MyComment key={moreComment?.id} moreComent={moreComment} />
              );
            })}
          </section>
        </Comment>
      </Comment.Group>
    </>
  );
}
