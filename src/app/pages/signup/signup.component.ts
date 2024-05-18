import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from 'src/app/service/cadastro/cadastro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
  alunoForm: FormGroup;

  constructor(
    private formulario: FormBuilder,
    private cadastroService: CadastroService,
    private router: Router
    ) {
    this.alunoForm = this.formulario.group({
      name: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.alunoForm.valid) {
      this.cadastroService.cadastrar(this.alunoForm.value).subscribe(
        (response) => {
          this.router.navigate(['client/dashboard']);
        },
        (error) => {
          alert('Não foi possível fazer o cadastro, tente mais tarde');
        }
      );
    }
  }

}