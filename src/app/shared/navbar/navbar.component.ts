import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';
import { StudentService } from 'src/app/service/student/student.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$ = this.userService.retornaUsuario();
  student: any;

  constructor(
    private userService: UserService, 
    private router: Router,
    private studentService: StudentService
    ) {}

  ngOnInit(): void {
    this.studentService.getStudent().subscribe((student) => {
        this.student = student;
    });
  }

  getFirstName(fullName: string | undefined): string | undefined {
    if (!fullName) return undefined;
    const firstName = fullName.split(' ')[0];
    return firstName;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

}
