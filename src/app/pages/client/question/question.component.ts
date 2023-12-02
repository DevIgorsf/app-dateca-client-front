import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    });
  }


  answerQuestion() {
    this.questionService.answerQuestion(this.id, this.formulario).subscribe(
      (data: any) => console.log(data)
    );
  }
}
