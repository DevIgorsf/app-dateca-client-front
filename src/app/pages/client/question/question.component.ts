
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionMultipleChoice } from 'src/app/interfaces/questionMultipleChoice';
import { QuestionService } from 'src/app/service/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  formulario: FormGroup;
  dado: any;
  images: any[] = [];

  id: any;
  statement: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;

  @Input() items: any[] = [];
  slideIndex = 0;
  slideOffset = '0';

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
    this.questionService.getQuestaoAleatoria().subscribe((dado: QuestionMultipleChoice) => {
      this.id = dado.id;
      this.statement = dado.statement;
      this.images = dado.images,
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

      if(dado.images) {
        this.images = dado.images.map(response => {
          return 'data:image/jpeg;base64,' + response.imagem;
        });
      }
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

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goToSlide(index);
    }
  }

  goToSlide(index: number): void {
    this.slideIndex = index;
  }
  prevSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
      this.updateSlideOffset();
    } else {
      // Se estiver na primeira imagem, volte para a última
      this.slideIndex = this.images.length - 1;
      this.updateSlideOffset();
    }
  }

  nextSlide(): void {
    if (this.slideIndex < this.images.length - 1) {
      this.slideIndex++;
      this.updateSlideOffset();
    } else {
      // Se estiver na última imagem, volte para a primeira
      this.slideIndex = 0;
      this.updateSlideOffset();
    }
  }

  updateSlideOffset(): void {
    this.slideOffset = `-${this.slideIndex * 100}%`;
  }
}
