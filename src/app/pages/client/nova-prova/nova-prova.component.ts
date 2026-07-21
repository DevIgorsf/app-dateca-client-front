import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nova-prova',
  imports: [RouterModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nova-prova.component.html',
  styleUrls: ['./nova-prova.component.scss']
})
export class NovaProvaComponent {}
