import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client.component';
import { QuestionComponent } from './question/question.component';
import { QuestionRespostaComponent } from './question-resposta/question-resposta.component';
import { ProfileComponent } from './profile/profile.component';
import { EnadeComponent } from './enade/enade.component';
import { EnadeRespostaComponent } from './enade-resposta/enade-resposta.component';
import { PontuacaoComponent } from './pontuacao/pontuacao.component';
import { AdicionarComponent } from './adicionar/adicionar.component';
import { CriarProvaComponent } from './criar-prova/criar-prova.component';
import { MinhasProvasComponent } from './minhas-provas/minhas-provas.component';
import { VisualizarProvaComponent } from './visualizar-prova/visualizar-prova.component';



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
      {
        path: 'adicionar',
        component: AdicionarComponent,
      },
      {
        path: 'pontuacao',
        component: PontuacaoComponent,
      },
      {
        path: 'provas',
        component: MinhasProvasComponent,
      },
      {
        path: 'provas/criar',
        component: CriarProvaComponent,
      },
      {
        path: 'provas/editar/:id',
        component: CriarProvaComponent,
      },
      {
        path: 'provas/visualizar/:id',
        component: VisualizarProvaComponent,
      },
      {
        path: 'importacao',
        loadComponent: () =>
          import('./importacao/upload/importacao-upload.component').then((m) => m.ImportacaoUploadComponent),
      },
      {
        path: 'importacao/:jobId/revisao',
        loadComponent: () =>
          import('./importacao/revisao/importacao-revisao.component').then((m) => m.ImportacaoRevisaoComponent),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
