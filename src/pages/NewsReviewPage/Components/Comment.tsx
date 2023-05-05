import {
  CommentDataType,
  CommentPropsTypes,
  CommentType,
} from "./Comment.types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { newsItemUrl } from "../../NewsPage/NewsPage.constants";
import { Comment } from "semantic-ui-react";

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
        setMoreComments((prevState: [] | CommentType[]) => {
          return [...prevState, data];
        });
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Comment.Group>
        {/*<Header as="h3" dividing>*/}
        {/*  Comments*/}
        {/*</Header>*/}

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
                  show more {comment?.kids.length}
                </Comment.Action>
              )}
            </Comment.Actions>
          </Comment.Content>
          {/*<Comment.Group>*/}
          {/*  <Comment>*/}
          {/*    <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />*/}
          {/*    <Comment.Content>*/}
          {/*      <Comment.Author as="a">Jenny Hess</Comment.Author>*/}
          {/*      <Comment.Metadata>*/}
          {/*        <div>Just now</div>*/}
          {/*      </Comment.Metadata>*/}
          {/*      <Comment.Text>Elliot you are always so right :)</Comment.Text>*/}
          {/*      <Comment.Actions>*/}
          {/*        <Comment.Action>Reply</Comment.Action>*/}
          {/*      </Comment.Actions>*/}
          {/*    </Comment.Content>*/}
          {/*  </Comment>*/}
          {/*</Comment.Group>*/}
        </Comment>
      </Comment.Group>
    </>
  );
}
