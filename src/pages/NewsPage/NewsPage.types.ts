export interface NewsIdTypes {
  data: number[];
}

export interface NewsType {
  by: string;
  descendants: number;
  id: number;
  kids: number[] | [];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export interface NewsDataType {
  data: NewsType;
}
