import { ObjectId } from "mongodb";

export type Assist = {
  _id: ObjectId;
  name: string;
  subname: string;
  created_at: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number | 0;
  };
};
