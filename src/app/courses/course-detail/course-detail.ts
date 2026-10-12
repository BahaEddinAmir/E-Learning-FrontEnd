import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../shared/services/auth';
import { CourseService, CourseResponse, ChapterResponse, ModuleResponse } from '../../shared/services/course';
import { EnrollmentService } from '../../shared/services/enrollment';
import { CourseProgressService, ChapterQuizResult } from '../../shared/services/course-progress';
import { CertificateService } from '../../shared/services/certificate';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SafeUrlPipe],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetailComponent implements OnInit {
  courseId!: number;
  course: CourseResponse | null = null;
  modules: ModuleResponse[] = [];

  isStudent = false;
  isOwner = false;
  isEnrolled = false;
  isLoading = true;
  error = '';

  // Interactive chapter progression
  selectedChapter: ChapterResponse | null = null;
  completedChapterIds: Set<number> = new Set();
  chapterAnswers: { [questionId: number]: string } = {};
  chapterQuizResult: ChapterQuizResult | null = null;
  isSubmittingQuiz = false;
  showQuiz = false;

  // Certificate
  certificateId: number | null = null;
  isDownloadingCert = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private courseProgressService: CourseProgressService,
    private certificateService: CertificateService,
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.isStudent = this.authService.getRole() === 'STUDENT';
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    const course$ = this.courseService.getCourseById(this.courseId);
    const enrollment$ = this.isStudent
      ? this.enrollmentService.isEnrolled(this.courseId).pipe(catchError(() => of(false)))
      : of(false);
    const completedChapters$ = this.isStudent
      ? this.courseProgressService.getCompletedChapterIds(this.courseId).pipe(catchError(() => of([])))
      : of([]);
    const certificates$ = this.isStudent
      ? this.certificateService.getMyCertificates().pipe(catchError(() => of([])))
      : of([]);

    forkJoin([course$, enrollment$, completedChapters$, certificates$]).subscribe({
      next: ([course, enrolled, completedIds, certs]) => {
        this.course = course;
        this.modules = course.modules || [];
        this.isEnrolled = enrolled as boolean;
        this.completedChapterIds = new Set(completedIds as number[]);

        // Check ownership for formateur
        const currentUser = this.authService.getCurrentUser();
        this.isOwner =
          !this.isStudent &&
          currentUser !== null &&
          `${currentUser.firstName} ${currentUser.lastName}` === course.formateurName;

        // Check if student already has certificate for this course
        const certList = certs as any[];
        const existing = certList.find((c: any) => c.courseId === this.courseId || c.course?.id === this.courseId);
        if (existing) {
          this.certificateId = existing.id;
        }

        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement du cours.';
        this.isLoading = false;
      },
    });
  }

  enroll(): void {
    this.enrollmentService.enroll(this.courseId).subscribe({
      next: () => {
        this.isEnrolled = true;
      },
      error: (err) => console.error('Failed to enroll', err),
    });
  }

  selectChapter(chapter: ChapterResponse): void {
    if (!this.isEnrolled) return;
    this.selectedChapter = chapter;
    this.chapterAnswers = {};
    this.chapterQuizResult = null;
    this.showQuiz = false;
  }

  closeChapter(): void {
    this.selectedChapter = null;
    this.chapterAnswers = {};
    this.chapterQuizResult = null;
    this.showQuiz = false;
  }

  selectAnswer(questionId: number, option: string): void {
    this.chapterAnswers[questionId] = option;
  }

  submitChapterQuiz(): void {
    if (!this.selectedChapter) return;
    this.isSubmittingQuiz = true;
    this.courseProgressService.submitChapterQuiz({
      chapterId: this.selectedChapter.id,
      answers: this.chapterAnswers,
    }).subscribe({
      next: (result) => {
        this.chapterQuizResult = result;
        this.isSubmittingQuiz = false;
        if (result.passed && this.selectedChapter) {
          this.completedChapterIds.add(this.selectedChapter.id);
        }
        // Refresh progress to pick up any new certificate
        this.refreshCertificates();
      },
      error: () => {
        this.isSubmittingQuiz = false;
      },
    });
  }

  isChapterCompleted(chapterId: number): boolean {
    return this.completedChapterIds.has(chapterId);
  }

  get totalChapters(): number {
    return this.modules.reduce((sum, m) => sum + (m.chapters?.length || 0), 0);
  }

  get progressPercent(): number {
    if (this.totalChapters === 0) return 0;
    return Math.round((this.completedChapterIds.size / this.totalChapters) * 100);
  }

  refreshCertificates(): void {
    this.certificateService.getMyCertificates().pipe(catchError(() => of([]))).subscribe({
      next: (certs: any[]) => {
        const existing = certs.find((c: any) => c.courseId === this.courseId || c.course?.id === this.courseId);
        if (existing) {
          this.certificateId = existing.id;
        }
      }
    });
  }

  downloadCertificate(): void {
    if (!this.certificateId) return;
    this.isDownloadingCert = true;
    this.certificateService.downloadCertificate(this.certificateId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificat_${this.courseId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isDownloadingCert = false;
      },
      error: () => {
        this.isDownloadingCert = false;
      },
    });
  }

  goToManage(): void {
    this.router.navigate(['/courses/manage', this.courseId]);
  }

  goToQuiz(quizId: number): void {
    this.router.navigate(['/quiz', quizId]);
  }
}
