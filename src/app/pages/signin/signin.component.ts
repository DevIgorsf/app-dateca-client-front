import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  logIn() {
    this.authService.autenticar(this.login, this.password).subscribe({
      next: () => {
        this.router.navigate(['client/dashboard']);
      },
      error: (error) => {
        if (error.status === 403) {
          this.toastr.error('Acesso proibido. Verifique suas credenciais.');
        } else {
          this.toastr.error(error.message);
        }
      },
    });
  }
}
