export interface CommentPropsTypes {
  moreComent?:CommentType
  commentID?:number
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
