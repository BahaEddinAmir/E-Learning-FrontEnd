import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChapterQuizSubmitRequest {
  chapterId: number;
  answers: { [questionId: number]: string };
}

export interface ChapterQuizResult {
  score: number;
  passed: boolean;
  canProceed: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CourseProgressService {
  private apiUrl = '/api/progress';

  constructor(private http: HttpClient) {}

  submitChapterQuiz(request: ChapterQuizSubmitRequest): Observable<ChapterQuizResult> {
    return this.http.post<ChapterQuizResult>(`${this.apiUrl}/chapter/quiz`, request);
  }

  getCompletedChapterIds(courseId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/course/${courseId}/completed-chapters`);
  }
}
