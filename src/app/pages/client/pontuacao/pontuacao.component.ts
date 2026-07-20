import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/service/student/student.service';
import { buildRankingEntries, RankingEntry } from 'src/app/shared/utils/ranking.util';

@Component({
  selector: 'app-pontuacao',
  templateUrl: './pontuacao.component.html',
  styleUrls: ['./pontuacao.component.scss']
})
export class PontuacaoComponent implements OnInit {
  rankingStudents: RankingEntry[] = [];
  loading = true;

  private rawRanking: any[] = [];
  private currentStudentName?: string;

  constructor(
    private service: StudentService,
  ) {}

  ngOnInit(): void {
    this.service.getRanking().subscribe({
      next: (response) => {
        this.rawRanking = response || [];
        this.refreshEntries();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.service.getStudent().subscribe({
      next: (student) => {
        this.currentStudentName = student?.name;
        this.refreshEntries();
      },
      error: () => {}
    });
  }

  get first(): RankingEntry | undefined {
    return this.rankingStudents[0];
  }

  get second(): RankingEntry | undefined {
    return this.rankingStudents[1];
  }

  get third(): RankingEntry | undefined {
    return this.rankingStudents[2];
  }

  get hasPodium(): boolean {
    return this.rankingStudents.length >= 3;
  }

  private refreshEntries(): void {
    this.rankingStudents = buildRankingEntries(this.rawRanking, this.currentStudentName);
  }
}
