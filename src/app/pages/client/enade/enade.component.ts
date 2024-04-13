import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnadeService } from 'src/app/service/enade/enade.service';

@Component({
  selector: 'app-enade',
  templateUrl: './enade.component.html',
  styleUrls: ['./enade.component.scss']
})
export class EnadeComponent {
  formulario: FormGroup;
  dado: any;
  images:any;

  id: any;
  idImages: any;
  statement: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;

  @Input() items: any[] = [];
  slideIndex: number = 0;
  slideOffset: string = '0';

  constructor(
    private formBuilder: FormBuilder,
    private enadeService: EnadeService,
    private route: Router
  ) {
    this.formulario = this.formBuilder.group({
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.enadeService.getEnadeAleatoria().subscribe((dado: any) => {
      this.id = dado.id;
      this.statement = dado.statement;
      this.idImages = dado.idImages[0],
      this.alternativeA = dado.alternativeA;
      this.alternativeB = dado.alternativeB;
      this.alternativeC = dado.alternativeC;
      this.alternativeD = dado.alternativeD;
      this.alternativeE = dado.alternativeE;

      this.enadeService.setStatement(dado.statement);
      this.enadeService.setAlternativeA(dado.alternativeA);
      this.enadeService.setAlternativeB(dado.alternativeB);
      this.enadeService.setAlternativeC(dado.alternativeC);
      this.enadeService.setAlternativeD(dado.alternativeD);
      this.enadeService.setAlternativeE(dado.alternativeE);

      if(dado.IdImages[0]) {
        this.enadeService.getImages(dado.idImages[0]).subscribe(
          (response: any) => {
            this.images = 'data:image/jpeg;base64,' + response.imagem;
          },
          (error) => {
            console.error('Erro ao buscar a imagem:', error);
          }
        );
      }
    });

    
  }

  answerEnade() {
    this.enadeService.answerEnade(this.id, this.formulario.value).subscribe(
      (data: any) => {
        this.enadeService.setAnswer(data);
        this.route.navigate(['client/quizz/resposta']);
      }
    );
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
