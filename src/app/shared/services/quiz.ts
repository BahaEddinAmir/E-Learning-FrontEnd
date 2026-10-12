import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionRequest {
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  orderIndex: number;
}

export interface QuestionResponse {
  id: number;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  orderIndex: number;
}

export interface QuizRequest {
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: QuestionRequest[];
}

export interface QuizResponse {
  id: number;
  title: string;
  passingScore: number;
  maxAttempts: number;
  courseId: number;
  questions: QuestionRequest[];
}

export interface QuizTakeResponse {
  id: number;
  title: string;
  passingScore: number;
  maxAttempts: number;
  questions: QuestionResponse[];
}

export interface QuizSubmitRequest {
  quizId: number;
  answers: { [questionId: number]: string };
}

export interface QuizResultResponse {
  score: number;
  passed: boolean;
  attemptNumber: number;
  message: string;
  certificateUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createQuiz(courseId: number, request: QuizRequest): Observable<QuizResponse> {
    return this.http.post<QuizResponse>(`${this.apiUrl}/courses/${courseId}/quiz`, request);
  }

  getQuizToTake(quizId: number): Observable<QuizTakeResponse> {
    return this.http.get<QuizTakeResponse>(`${this.apiUrl}/quiz/${quizId}/take`);
  }

  submitQuiz(request: QuizSubmitRequest): Observable<QuizResultResponse> {
    return this.http.post<QuizResultResponse>(`${this.apiUrl}/quiz/submit`, request);
  }
}
