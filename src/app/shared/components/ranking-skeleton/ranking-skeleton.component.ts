import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-skeleton.component.html',
  styleUrls: ['./ranking-skeleton.component.scss'],
})
export class RankingSkeletonComponent {
  rows = input(6);

  protected rowsArray = computed(() => Array.from({ length: this.rows() }, (_, index) => index));
}
