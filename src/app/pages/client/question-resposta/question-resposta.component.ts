import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/service/question/question.service';

@Component({
  selector: 'app-question-resposta',
  templateUrl: './question-resposta.component.html',
  styleUrls: ['./question-resposta.component.scss']
})
export class QuestionRespostaComponent {

  answer: any;
  statement: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;
  question__resposta: any;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
  ) {}

  ngOnInit() {
    this.answer = this.questionService.getAnswer();
    this.statement = this.questionService.getStatement();
    this.alternativeA = this.questionService.getAlternativeA();
    this.alternativeB = this.questionService.getAlternativeB();
    this.alternativeC = this.questionService.getAlternativeC();
    this.alternativeD = this.questionService.getAlternativeD();
    this.alternativeE = this.questionService.getAlternativeE();
  }
}
