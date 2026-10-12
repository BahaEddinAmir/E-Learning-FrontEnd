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

export interface VideoRequest {
  title: string;
  url: string;
  duration: number;
  orderIndex: number;
}

export interface ModuleResponse {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  videos: VideoResponse[];
}

export interface ModuleRequest {
  title: string;
  description: string;
  orderIndex: number;
}

@Injectable({ providedIn: 'root' })
export class ModuleService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getModules(courseId: number): Observable<ModuleResponse[]> {
    return this.http.get<ModuleResponse[]>(`${this.apiUrl}/courses/${courseId}/modules`);
  }

  createModule(courseId: number, request: ModuleRequest): Observable<ModuleResponse> {
    return this.http.post<ModuleResponse>(`${this.apiUrl}/courses/${courseId}/modules`, request);
  }

  addVideo(moduleId: number, request: VideoRequest): Observable<VideoResponse> {
    return this.http.post<VideoResponse>(`${this.apiUrl}/modules/${moduleId}/videos`, request);
  }
}
