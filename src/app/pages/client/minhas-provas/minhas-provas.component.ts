import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyStateComponent } from 'src/app/shared/components/empty-state/empty-state.component';
import { ProvaSummary } from 'src/app/interfaces/prova';
import { ProvaService } from 'src/app/service/prova/prova.service';
import { formatarDataBr } from 'src/app/shared/utils/date.util';
import { provaStatusClass, provaStatusLabel } from 'src/app/shared/utils/prova.util';

@Component({
  selector: 'app-minhas-provas',
  imports: [RouterModule, MatCardModule, MatIconModule, MatTooltipModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './minhas-provas.component.html',
  styleUrls: ['./minhas-provas.component.scss']
})
export class MinhasProvasComponent implements OnInit {
  readonly formatarData = formatarDataBr;
  readonly statusLabel = provaStatusLabel;
  readonly statusClass = provaStatusClass;

  provas = signal<ProvaSummary[]>([]);
  loading = signal(true);
  toastMessage = signal<string | null>(null);

  private toastTimeout?: ReturnType<typeof setTimeout>;

  constructor(private provaService: ProvaService) {}

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.loading.set(true);
    this.provaService.getMinhasProvas().subscribe({
      next: (page) => {
        this.provas.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  podeVisualizar(prova: ProvaSummary): boolean {
    return prova.status !== 'DRAFT';
  }

  podeCompartilhar(prova: ProvaSummary): boolean {
    return prova.status === 'ACTIVE' || prova.status === 'CLOSED';
  }

  compartilhar(prova: ProvaSummary): void {
    if (!this.podeCompartilhar(prova)) {
      return;
    }
    const link = `${window.location.origin}/client/provas/visualizar/${prova.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    this.mostrarToast('Link da prova copiado para a área de transferência.');
  }

  excluir(prova: ProvaSummary): void {
    const confirmado = window.confirm(`Excluir a prova "${prova.titulo}"? Esta ação não pode ser desfeita.`);
    if (!confirmado) {
      return;
    }
    this.provaService.excluirProva(prova.id).subscribe({
      next: () => {
        this.provas.update((lista) => lista.filter((p) => p.id !== prova.id));
        this.mostrarToast('Prova excluída.');
      },
      error: () => {
        this.mostrarToast('Não foi possível excluir a prova.');
      }
    });
  }

  private mostrarToast(mensagem: string): void {
    this.toastMessage.set(mensagem);
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
