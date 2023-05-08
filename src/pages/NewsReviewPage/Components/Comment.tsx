import {
  CommentDataType,
  CommentPropsTypes,
  CommentType,
} from "./Comment.types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { newsItemUrl } from "../../NewsPage/NewsPage.constants";
import { Button, Comment } from "semantic-ui-react";
import { mapTime } from "../../NewsPage/components/News/News.utils";

export function MyComment({ commentID, moreComent }: CommentPropsTypes) {
  const [comment, setComment] = useState<CommentType | undefined>(undefined);
  const [moreComments, setMoreComments] = useState<CommentType[] | []>([]);
  const [showMoreComments, setShowMoreComments] = useState<true | false>(false);

  const getComment = async (commentID: number) => {
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
    if (commentID) {
      void getComment(commentID);
    }
  }, [commentID]);

  const LoadMoreComments = async (more: boolean) => {
    setShowMoreComments(!showMoreComments);
    try {
      if (more && !moreComments.length) {
        moreComent?.kids?.map(async (commentID: number) => {
          const moreCommentsFetchUrl = `${newsItemUrl}${commentID}.json`;
          const commentData: CommentDataType = await axios.get(
            moreCommentsFetchUrl
          );
          const { data } = commentData;

          setMoreComments((prevState: [] | CommentType[]) => {
            return [...prevState, data].sort((a, b) => {
              return a.time - b.time;
            });
          });
        });
      } else {
        comment?.kids?.map(async (commentID: number) => {
          const moreCommentsFetchUrl = `${newsItemUrl}${commentID}.json`;
          const commentData: CommentDataType = await axios.get(
            moreCommentsFetchUrl
          );
          const { data } = commentData;
          if (!moreComments.length) {
            setMoreComments((prevState: [] | CommentType[]) => {
              return [...prevState, data].sort((a, b) => {
                return a.time - b.time;
              });
            });
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const convertTime: number = mapTime(comment?.time || moreComent?.time);
  return (
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
          <Comment.Content>
            <Comment.Author as="a">{comment?.by}</Comment.Author>
            <Comment.Metadata>
              <div>{convertTime} days ago</div>
            </Comment.Metadata>
            <Comment.Text>
              <p>{comment?.text || moreComent?.text}</p>
            </Comment.Text>
            <Comment.Actions>
              {comment?.kids && (
                <Comment.Action>
                  <Button onClick={() => LoadMoreComments(false)}>
                    {!moreComments.length
                      ? `   Show answers (${comment?.kids.length})`
                      : "Hide"}
                  </Button>
                </Comment.Action>
              )}
              {moreComent?.kids && (
                <Comment.Action>
                  <Button onClick={() => LoadMoreComments(true)}>
                    {!moreComments.length
                      ? `   Show answers more (${moreComent?.kids.length})`
                      : "Hide"}
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
            {moreComments.map((moreComent: CommentType) => {
              return <MyComment key={moreComent?.id} moreComent={moreComent} />;
            })}
          </section>
        </Comment>
      </Comment.Group>
    </>
  );
}
