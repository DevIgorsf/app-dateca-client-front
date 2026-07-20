import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ClientComponent {

}
