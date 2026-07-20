import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { SidebarComponent } from 'src/app/shared/sidebar/sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuestionComponent } from './question/question.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionRespostaComponent } from './question-resposta/question-resposta.component';
import { ProfileComponent } from './profile/profile.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EnadeComponent } from './enade/enade.component';
import { EnadeRespostaComponent } from './enade-resposta/enade-resposta.component';
import { AdicionarComponent } from './adicionar/adicionar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ClientComponent,
    NavbarComponent,
    SidebarComponent,
    QuestionComponent,
    QuestionRespostaComponent,
    ProfileComponent,
    EnadeComponent,
    EnadeRespostaComponent,
    AdicionarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports: [ClientComponent],
})
export class ClientModule { }
