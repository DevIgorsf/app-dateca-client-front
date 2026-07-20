import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RankingEntry } from 'src/app/shared/utils/ranking.util';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.scss'],
})
export class RankingListComponent {
  entries = input<RankingEntry[]>([]);
  emptyMessage = input('Nenhum participante no ranking ainda.');

  protected first = computed(() => this.entries()[0]);
  protected second = computed(() => this.entries()[1]);
  protected third = computed(() => this.entries()[2]);
  protected hasPodium = computed(() => this.entries().length >= 3);
}
