import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-empty-state',
    imports: [RouterModule, MatButtonModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  icon = input('info');
  title = input('');
  description = input('');
  actionLabel = input<string | null>(null);
  actionLink = input<string | null>(null);
}
