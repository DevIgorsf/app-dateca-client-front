import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from 'src/app/service/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {

  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
  ) {
    this.formulario = this.formBuilder.group({
      correctAnswer: ['', Validators.required]
    });
  }


  answerQuestion() {
    console.log("passou");
    console.log(this.formulario.value);
    // this.questionService.answerQuestion(this.formulario).subscribe(
    //   (data: any) => console.log(data)
    // );
  }
}
