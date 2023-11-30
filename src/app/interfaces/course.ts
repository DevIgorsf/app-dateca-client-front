import { Professor } from "./professor";
import { Question } from "./question";

export interface Course {
  id?: number;
  code: string
  name: string
  semester: number,
  professorList: Professor[];
  questionList?: Question[];
}
