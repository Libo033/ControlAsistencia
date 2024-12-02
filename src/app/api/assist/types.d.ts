import { ObjectId } from "mongodb";

export type Assist = {
  _id: ObjectId;
  name: string;
  subname: string;
  created_at: Date;
};

export type AssistPost = {
  name: string;
  subname: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};
