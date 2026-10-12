import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../shared/services/auth';
import { CourseService, FormateurCourse, FormateurStats } from '../../shared/services/course';

@Component({
  selector: 'app-formateur-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
  ],
  templateUrl: './formateur-dashboard.html',
  styleUrl: './formateur-dashboard.scss',
})
export class FormateurDashboardComponent implements OnInit {
  user: any;
  stats: FormateurStats = { courses: 0, students: 0, quizzes: 0, published: 0 };
  myCourses: FormateurCourse[] = [];

  showCreateForm = false;
  newCourseTitle = '';
  newCourseDescription = '';
  error = '';

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadStats();
    this.loadCourses();
  }

  private loadStats(): void {
    this.courseService.getMyStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error('Failed to load stats', err),
    });
  }

  private loadCourses(): void {
    this.courseService.getMyCourses().subscribe({
      next: (data) => (this.myCourses = data),
      error: (err) => console.error('Failed to load courses', err),
    });
  }

  createCourse(): void {
    if (!this.newCourseTitle) {
      this.error = 'Le titre est obligatoire.';
      return;
    }
    this.courseService
      .createCourse({
        title: this.newCourseTitle,
        description: this.newCourseDescription,
        categoryId: 0,
      })
      .subscribe({
        next: (course) => {
          this.newCourseTitle = '';
          this.newCourseDescription = '';
          this.showCreateForm = false;
          this.error = '';
          this.loadCourses();
          this.loadStats();
          this.router.navigate(['/courses/manage', course.id]);
        },
        error: () => (this.error = 'Erreur lors de la création du cours.'),
      });
  }

  manageCourse(courseId: number): void {
    this.router.navigate(['/courses/manage', courseId]);
  }
}
