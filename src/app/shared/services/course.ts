import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoResponse {
  id: number;
  title: string;
  url: string;
  duration: number;
  orderIndex: number;
}

export interface ChapterResponse {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  orderIndex: number;
  questions: QuestionResponse[];
}

export interface QuestionResponse {
  id: number;
  content: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  orderIndex: number;
}

export interface ModuleResponse {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  chapters: ChapterResponse[];
  videos: VideoResponse[];
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  categoryName: string;
  formateurName: string;
  modulesCount: number;
  quizId: number | null;
  modules?: ModuleResponse[];
}

export interface CourseRequest {
  title: string;
  description: string;
  categoryId: number;
}

export interface FormateurCourse {
  id: number;
  title: string;
  status: string;
  studentsCount: number;
}

export interface FormateurStats {
  courses: number;
  students: number;
  quizzes: number;
  published: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = '/api/courses';

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.apiUrl}/${id}`);
  }

  createCourse(request: CourseRequest): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(this.apiUrl, request);
  }

  updateCourse(id: number, request: CourseRequest): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.apiUrl}/${id}`, request);
  }

  getMyCourses(): Observable<FormateurCourse[]> {
    return this.http.get<FormateurCourse[]>(`${this.apiUrl}/my`);
  }

  getMyStats(): Observable<FormateurStats> {
    return this.http.get<FormateurStats>(`${this.apiUrl}/my/stats`);
  }

  getMine(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.apiUrl}/mine`);
  }
}
