import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { ProvaDetalheDTO, ProvaRankingDTO } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';
import { StudentService } from 'src/app/service/student/student.service';
import { formatarDataBr } from 'src/app/shared/utils/date.util';
import { getAvatarColor, getInitials } from 'src/app/shared/utils/avatar.util';

/** Linha do ranking já achatada e com os dados de apresentação prontos para o template. */
interface RankingProvaRow {
  posicao: number;
  nome: string;
  iniciais: string;
  cor: string;
  acertos: number;
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-visualizar-prova',
  imports: [RouterModule, MatCardModule, MatIconModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visualizar-prova.component.html',
  styleUrls: ['./visualizar-prova.component.scss']
})
export class VisualizarProvaComponent implements OnInit {
  readonly formatarData = formatarDataBr;

  prova = signal<ProvaDetalheDTO | null>(null);
  loading = signal(true);
  notFound = signal(false);

  ranking = signal<RankingProvaRow[]>([]);
  rankingLoading = signal(false);

  private currentStudentName?: string;

  constructor(
    private route: ActivatedRoute,
    private provaService: ProvaService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.provaService.getProva(id).subscribe({
      next: (prova) => {
        this.prova.set(prova);
        this.loading.set(false);
        if (prova.rankingDisponivel) {
          this.carregarRanking(id);
        }
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  // Busca o nome do usuário logado (best-effort, para destacar "Você") e, em
  // seguida, o ranking da prova — ordenado pelo total de acertos no backend.
  private carregarRanking(id: string): void {
    this.rankingLoading.set(true);
    this.studentService.getStudent().subscribe({
      next: (student) => {
        this.currentStudentName = student?.name;
        this.buscarRanking(id);
      },
      error: () => this.buscarRanking(id),
    });
  }

  private buscarRanking(id: string): void {
    this.provaService.getRankingProva(id).subscribe({
      next: (itens) => {
        this.ranking.set(itens.map((item, index) => this.toRow(item, index)));
        this.rankingLoading.set(false);
      },
      error: () => this.rankingLoading.set(false),
    });
  }

  private toRow(item: ProvaRankingDTO, index: number): RankingProvaRow {
    return {
      posicao: item.posicao,
      nome: item.nomeAluno,
      iniciais: getInitials(item.nomeAluno),
      cor: getAvatarColor(index),
      acertos: item.acertos,
      isCurrentUser: !!this.currentStudentName && item.nomeAluno === this.currentStudentName,
    };
  }
}
