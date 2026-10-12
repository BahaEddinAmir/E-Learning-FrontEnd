import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { CourseService, CourseResponse, ModuleResponse } from '../../shared/services/course';
import { QuizService, QuestionRequest } from '../../shared/services/quiz';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-course-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './course-manage.html',
  styleUrl: './course-manage.scss',
})
export class CourseManageComponent implements OnInit {
  courseId!: number;
  course: CourseResponse | null = null;
  modules: ModuleResponse[] = [];

  // Module form
  showModuleForm = false;
  newModuleTitle = '';
  newModuleDescription = '';

  // Chapter form
  showChapterFormFor: number | null = null;
  newChapterTitle = '';
  newChapterDescription = '';
  newChapterVideoUrl = '';
  newChapterDuration = 0;

  // Quiz form
  showQuizForm = false;
  hasQuiz = false;
  quizTitle = '';
  quizPassingScore = 70;
  quizMaxAttempts = 3;
  questions: QuestionRequest[] = [];

  isLoading = true;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private quizService: QuizService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse(): void {
    this.isLoading = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.modules = data.modules ?? [];
        this.hasQuiz = data.quizId != null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load course', err);
        this.error = 'Cours introuvable ou erreur de chargement.';
        this.isLoading = false;
      },
    });
  }

  addModule(): void {
    if (!this.newModuleTitle.trim()) return;
    const orderIndex = this.modules.length + 1;
    this.http
      .post<ModuleResponse>(`/api/courses/${this.courseId}/modules`, {
        title: this.newModuleTitle,
        description: this.newModuleDescription,
        orderIndex,
      })
      .subscribe({
        next: () => {
          this.newModuleTitle = '';
          this.newModuleDescription = '';
          this.showModuleForm = false;
          this.success = 'Module ajouté avec succès.';
          this.loadCourse();
        },
        error: () => (this.error = "Erreur lors de l'ajout du module."),
      });
  }

  toggleChapterForm(moduleId: number): void {
    this.showChapterFormFor = this.showChapterFormFor === moduleId ? null : moduleId;
    this.newChapterTitle = '';
    this.newChapterDescription = '';
    this.newChapterVideoUrl = '';
    this.newChapterDuration = 0;
  }

  addChapter(moduleId: number): void {
    if (!this.newChapterTitle.trim()) return;
    const module = this.modules.find((m) => m.id === moduleId);
    const orderIndex = module ? (module.chapters?.length ?? 0) + 1 : 1;

    this.http
      .post(`/api/modules/${moduleId}/chapters`, {
        title: this.newChapterTitle,
        description: this.newChapterDescription,
        videoUrl: this.newChapterVideoUrl,
        videoDuration: this.newChapterDuration,
        orderIndex,
      })
      .subscribe({
        next: () => {
          this.showChapterFormFor = null;
          this.success = 'Chapitre ajouté avec succès.';
          this.loadCourse();
        },
        error: () => (this.error = "Erreur lors de l'ajout du chapitre."),
      });
  }

  addQuestion(): void {
    this.questions.push({
      content: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      orderIndex: this.questions.length + 1,
    });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  saveQuiz(): void {
    if (!this.quizTitle || this.questions.length === 0) {
      this.error = 'Ajoutez un titre et au moins une question.';
      return;
    }

    this.quizService
      .createQuiz(this.courseId, {
        title: this.quizTitle,
        passingScore: this.quizPassingScore,
        maxAttempts: this.quizMaxAttempts,
        questions: this.questions,
      })
      .subscribe({
        next: () => {
          this.success = 'Quiz créé avec succès.';
          this.showQuizForm = false;
          this.hasQuiz = true;
        },
        error: () => (this.error = 'Erreur lors de la création du quiz.'),
      });
  }

  publishCourse(): void {
    this.http.put<CourseResponse>(`/api/courses/${this.courseId}/publish`, {}).subscribe({
      next: (data) => {
        this.course = data;
        this.success = 'Cours publié avec succès !';
      },
      error: () => (this.error = 'Erreur lors de la publication du cours.'),
    });
  }

  clearMessages(): void {
    this.error = '';
    this.success = '';
  }
}
