/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnadeWithImage } from 'src/app/interfaces/EnadeWithImage';
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
  year: any;
  number: any;
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
    this.enadeService.getEnadeAleatoria().subscribe((dado: EnadeWithImage) => {
      this.id = dado.id;
      this.year = dado.year;
      this.number = dado.number;
      this.statement = dado.statement;
      this.alternativeA = dado.alternativeA;
      this.alternativeB = dado.alternativeB;
      this.alternativeC = dado.alternativeC;
      this.alternativeD = dado.alternativeD;
      this.alternativeE = dado.alternativeE;
      this.images = dado.images,

      this.enadeService.setYear(dado.year);
      this.enadeService.setNumber(dado.number);
      this.enadeService.setStatement(dado.statement);
      this.enadeService.setAlternativeA(dado.alternativeA);
      this.enadeService.setAlternativeB(dado.alternativeB);
      this.enadeService.setAlternativeC(dado.alternativeC);
      this.enadeService.setAlternativeD(dado.alternativeD);
      this.enadeService.setAlternativeE(dado.alternativeE);

      if(dado.images.length > 0) {
        this.images = dado.images.map(response => {
          return 'data:image/jpeg;base64,' + response.imagem;
        });
      }
    });

    
  }

  answerEnade() {
    this.enadeService.answerEnade(this.id, this.formulario.value).subscribe(
      (data: any) => {
        this.enadeService.setAnswer(data);
        this.route.navigate(['client/enade/resposta']);
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
      this.slideIndex = this.images.length - 1;
      this.updateSlideOffset();
    }
  }

  nextSlide(): void {
    if (this.slideIndex < this.images.length - 1) {
      this.slideIndex++;
      this.updateSlideOffset();
    } else {
      this.slideIndex = 0;
      this.updateSlideOffset();
    }
  }

  updateSlideOffset(): void {
    this.slideOffset = `-${this.slideIndex * 100}%`;
  }
}
