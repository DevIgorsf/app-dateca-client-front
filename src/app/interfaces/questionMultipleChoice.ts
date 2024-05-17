import { Course } from "./course";
import { PointsEnum } from "./pointsEnum";
import { Professor } from "./professor";
import { QuestionTypeEnum } from "./questionTypeEnum";

export interface QuestionMultipleChoice {
  id?: any;
  statement: any;
  pointsEnum: any;
  course: any;
  correctAnswer: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;
  images: any[];
  [key: string]: any;
}
