import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/service/student/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rankingStudents: any[] = [];

  constructor(
    private studentService: StudentService,
    private route: Router
  ) { }

  ngOnInit() {
    this.studentService.rankingStudent().subscribe(
      (response) => {
        this.rankingStudents = response;
      }
    )
  }
}
