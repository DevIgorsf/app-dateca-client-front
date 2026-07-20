import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/auth/user.service';

const STORAGE_KEY = 'sidebar_collapsed';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent implements OnInit {
  collapsed = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.collapsed = localStorage.getItem(STORAGE_KEY) === 'true';
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
    localStorage.setItem(STORAGE_KEY, String(this.collapsed));
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['']);
  }
}
