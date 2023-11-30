import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  login = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logIn() {
    this.authService.autenticar(this.login, this.password).subscribe(
      () => {
        this.router.navigate(['client/dashboard']);
      },
      (error) => {
        console.log(error)
        alert('Login ou senha inválido');
      }
    );
  }
}
