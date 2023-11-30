import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { LoginGuard } from './service/auth/login.guard';
import { AuthGuard } from './service/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: SigninComponent,
    canLoad: [LoginGuard]
  },
  {
    path: 'client',
    loadChildren: () => import('./pages/client/client.module').then((m) => m.ClientModule),
    canLoad: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
