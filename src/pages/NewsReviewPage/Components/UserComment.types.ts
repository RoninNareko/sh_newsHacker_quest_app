export interface CommentPropsTypes {
  moreComment?: CommentType;
  commentID?: number;
}

export interface CommentType {
  by: string;
  id: number;
  parent: number;
  kids: number[] | undefined | [];
  text: string;
  time: Date;
  type: string;
}

export interface CommentDataType {
  data: CommentType;
}
