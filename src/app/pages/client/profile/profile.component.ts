import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/service/student/student.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  alunoForm!: FormGroup;

  constructor(
    private formulario: FormBuilder,
    private studentService: StudentService,
    private router: Router
    ) { }

  ngOnInit() {
    this.studentService.getStudent().subscribe((dado: any) => {
      this.alunoForm = this.formulario.group({
        name: [dado.name, Validators.required],
        registrationNumber: [dado.registrationNumber, Validators.required],
        phone: [dado.phone, Validators.required],
        email: [dado.email, [Validators.required, Validators.email]]
      });
    });
  }

  onSubmit() {
    if (this.alunoForm.valid) {
      this.studentService.updateStudent(this.alunoForm.value).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['client/dashboard']);
        },
        (error) => {
          console.log(error)
          alert('Não foi possível fazer o cadastro, tente mais tarde');
        }
      );
    }
  }
}
