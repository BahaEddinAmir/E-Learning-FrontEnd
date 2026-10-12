import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { QuizService, QuizTakeResponse, QuizResultResponse } from '../../shared/services/quiz';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './quiz-take.html',
  styleUrl: './quiz-take.scss',
})
export class QuizTakeComponent implements OnInit {
  quizId!: number;
  quiz: QuizTakeResponse | null = null;
  answers: { [questionId: number]: string } = {};

  result: QuizResultResponse | null = null;
  isLoading = true;
  isSubmitting = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuiz();
  }

  loadQuiz(): void {
    this.quizService.getQuizToTake(this.quizId).subscribe({
      next: (data) => {
        this.quiz = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement du quiz.';
        this.isLoading = false;
      },
    });
  }

  selectAnswer(questionId: number, option: string): void {
    this.answers[questionId] = option;
  }

  submit(): void {
    this.isSubmitting = true;
    this.quizService.submitQuiz({ quizId: this.quizId, answers: this.answers }).subscribe({
      next: (res) => {
        this.result = res;
        this.isSubmitting = false;
      },
      error: () => {
        this.error = 'Erreur lors de la soumission du quiz.';
        this.isSubmitting = false;
      },
    });
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard/student']);
  }
}
