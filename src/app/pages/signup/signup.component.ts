import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
  alunoForm: FormGroup;

  constructor(private formulario: FormBuilder) {
    this.alunoForm = this.formulario.group({
      nome: ['', Validators.required],
      matricula: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.alunoForm.valid) {
      console.log('Dados do Aluno:', this.alunoForm.value);
      // Adicione aqui a lógica para processar os dados do formulário, como enviá-los para um serviço
    }
  }
}
