import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../shared/services/auth';
import { EnrollmentService, Enrollment } from '../../shared/services/enrollment';
import { CertificateService, Certificate } from '../../shared/services/certificate';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    NavbarComponent,
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboardComponent implements OnInit {
  user: any;
  enrolledCourses: Enrollment[] = [];
  certificates: Certificate[] = [];
  stats = { enrolled: 0, completed: 0, certificates: 0, inProgress: 0 };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private certificateService: CertificateService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadAll();
  }

  private loadAll(): void {
    this.isLoading = true;
    forkJoin([
      this.enrollmentService.getMyEnrollments().pipe(catchError(() => of([]))),
      this.certificateService.getMyCertificates().pipe(catchError(() => of([]))),
    ]).subscribe({
      next: ([enrollments, certs]) => {
        this.enrolledCourses = enrollments;
        this.certificates = certs;
        this.computeStats(enrollments, certs);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private computeStats(courses: Enrollment[], certs: Certificate[]): void {
    this.stats = {
      enrolled: courses.length,
      completed: courses.filter((c) => c.progress === 100).length,
      inProgress: courses.filter((c) => c.progress > 0 && c.progress < 100).length,
      certificates: certs.length,
    };
  }

  downloadCertificate(cert: Certificate): void {
    this.certificateService.downloadCertificate(cert.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificat_${cert.uniqueNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed', err),
    });
  }
}
