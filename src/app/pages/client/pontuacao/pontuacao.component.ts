import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/service/student/student.service';

@Component({
  selector: 'app-pontuacao',
  templateUrl: './pontuacao.component.html',
  styleUrls: ['./pontuacao.component.scss']
})
export class PontuacaoComponent implements OnInit {
  rankingStudents: any[] = [];

  constructor(
    private service: StudentService,
  ) {}

  ngOnInit(): void {
    this.service.getRanking().subscribe(
      (response) => {
        this.rankingStudents = response;
      }
    )
  }
}
