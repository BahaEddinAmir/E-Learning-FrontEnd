import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../shared/services/auth';
import { UserService, PendingUser } from '../../shared/services/user';
import { AdminService, AdminStats, AdminUser } from '../../shared/services/admin';
import { CourseResponse } from '../../shared/services/course';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  user: any;

  stats: AdminStats = { users: 0, courses: 0, enrollments: 0, certificates: 0 };
  recentUsers: AdminUser[] = [];
  pendingCourses: CourseResponse[] = [];
  pendingUsers: PendingUser[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadStats();
    this.loadRecentUsers();
    this.loadPendingCourses();
    this.loadPendingUsers();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error('Failed to load stats', err),
    });
  }

  loadRecentUsers(): void {
    this.adminService.getRecentUsers().subscribe({
      next: (data) => (this.recentUsers = data),
      error: (err) => console.error('Failed to load recent users', err),
    });
  }

  loadPendingCourses(): void {
    this.adminService.getPendingCourses().subscribe({
      next: (data) => (this.pendingCourses = data),
      error: (err) => console.error('Failed to load pending courses', err),
    });
  }

  loadPendingUsers(): void {
    this.userService.getPendingUsers().subscribe({
      next: (data) => (this.pendingUsers = data),
      error: (err) => console.error('Failed to load pending users', err),
    });
  }

  approveUser(id: number): void {
    this.userService.approveUser(id).subscribe({
      next: () => this.loadPendingUsers(),
      error: (err) => console.error('Failed to approve user', err),
    });
  }

  rejectUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadPendingUsers(),
      error: (err) => console.error('Failed to reject user', err),
    });
  }

  approveCourse(id: number): void {
    this.adminService.approveCourse(id).subscribe({
      next: () => {
        this.loadPendingCourses();
        this.loadStats();
      },
      error: (err) => console.error('Failed to approve course', err),
    });
  }

  rejectCourse(id: number): void {
    this.adminService.rejectCourse(id).subscribe({
      next: () => this.loadPendingCourses(),
      error: (err) => console.error('Failed to reject course', err),
    });
  }
}
