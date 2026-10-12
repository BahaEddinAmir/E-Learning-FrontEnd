import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  status: string;
  totalModules: number;
  modulesCompleted: number;
  progress: number;
}

export interface EnrollmentRequest {
  courseId: number;
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private apiUrl = '/api/enrollments';

  constructor(private http: HttpClient) {}

  enroll(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, { courseId });
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/my`);
  }

  isEnrolled(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${courseId}`);
  }
}
