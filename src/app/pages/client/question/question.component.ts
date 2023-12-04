import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/service/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  formulario: FormGroup;
  dado: any;

  id: any;
  statement: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private route: Router
  ) {
    this.formulario = this.formBuilder.group({
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.questionService.getQuestaoAleatoria().subscribe((dado: any) => {
      this.id = dado.id;
      this.statement = dado.statement;
      this.alternativeA = dado.alternativeA;
      this.alternativeB = dado.alternativeB;
      this.alternativeC = dado.alternativeC;
      this.alternativeD = dado.alternativeD;
      this.alternativeE = dado.alternativeE;

      this.questionService.setStatement(dado.statement);
      this.questionService.setAlternativeA(dado.alternativeA);
      this.questionService.setAlternativeB(dado.alternativeB);
      this.questionService.setAlternativeC(dado.alternativeC);
      this.questionService.setAlternativeD(dado.alternativeD);
      this.questionService.setAlternativeE(dado.alternativeE);
    });
  }


  answerQuestion() {
    this.questionService.answerQuestion(this.id, this.formulario.value).subscribe(
      (data: any) => {
        this.questionService.setAnswer(data);
        this.route.navigate(['client/quizz/resposta']);
      }
    );
  }
}
