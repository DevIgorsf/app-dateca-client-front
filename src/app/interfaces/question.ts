import { QuestionTypeEnum } from "./questionTypeEnum";
import { Professor } from "./professor";
import { PointsEnum } from "./pointsEnum";
import { Course } from "./course";

export interface Question {
  id: number;
  statement: string;
  pointsEnum: PointsEnum;
  course: Course;
  questionTypeEnum?: QuestionTypeEnum;
  professorCreate: Professor;
}
