export interface CommentPropsTypes {
  commentID: number;
}

export interface CommentType {
  by: string;

  id: number;

  parent: number;
  kids: number[] | undefined | [];
  text: string;
  time: number;

  type: string;
}

export interface CommentDataType {
  data: CommentType;
}
