import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-my-position-card',
    imports: [MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './my-position-card.component.html',
    styleUrls: ['./my-position-card.component.scss']
})
export class MyPositionCardComponent {
  position = input.required<number>();
  label = input('');
  points = input<number | null>(null);
}
