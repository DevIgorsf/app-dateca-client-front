import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { Prova } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';
import { formatarDataBr } from 'src/app/shared/utils/date.util';

@Component({
  selector: 'app-visualizar-prova',
  imports: [RouterModule, MatCardModule, MatIconModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visualizar-prova.component.html',
  styleUrls: ['./visualizar-prova.component.scss']
})
export class VisualizarProvaComponent implements OnInit {
  readonly formatarData = formatarDataBr;

  prova = signal<Prova | null>(null);
  loading = signal(true);
  notFound = signal(false);

  constructor(
    private route: ActivatedRoute,
    private provaService: ProvaService,
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
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }
}
