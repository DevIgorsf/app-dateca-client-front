import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnadeService } from 'src/app/service/enade/enade.service';

@Component({
  selector: 'app-enade-resposta',
  templateUrl: './enade-resposta.component.html',
  styleUrls: ['./enade-resposta.component.scss']
})
export class EnadeRespostaComponent {
  answer: any;
  year: any;
  number: any;
  statement: any;
  alternativeA: any;
  alternativeB: any;
  alternativeC: any;
  alternativeD: any;
  alternativeE: any;
  question__resposta: any;

  constructor(
    private enadeService: EnadeService,
  ) {}

  ngOnInit() {
    this.answer = this.enadeService.getAnswer();
    this.year = this.enadeService.getYear();
    this.number = this.enadeService.getNumber();
    this.statement = this.enadeService.getStatement();
    this.alternativeA = this.enadeService.getAlternativeA();
    this.alternativeB = this.enadeService.getAlternativeB();
    this.alternativeC = this.enadeService.getAlternativeC();
    this.alternativeD = this.enadeService.getAlternativeD();
    this.alternativeE = this.enadeService.getAlternativeE();
  }
}
