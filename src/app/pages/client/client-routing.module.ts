import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client.component';
import { QuestionComponent } from './question/question.component';
import { QuestionRespostaComponent } from './question-resposta/question-resposta.component';
import { ProfileComponent } from './profile/profile.component';
import { EnadeComponent } from './enade/enade.component';
import { EnadeRespostaComponent } from './enade-resposta/enade-resposta.component';



const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'perfil',
        component: ProfileComponent,
      },
      {
        path: 'quizz',
        component: QuestionComponent,
      },
      {
        path: 'quizz/resposta',
        component: QuestionRespostaComponent,
      },
      {
        path: 'enade',
        component: EnadeComponent,
      },
      {
        path: 'enade/resposta',
        component: EnadeRespostaComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
