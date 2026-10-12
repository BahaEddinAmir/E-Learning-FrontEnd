import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PendingUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/admin/users';

  constructor(private http: HttpClient) {}

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.apiUrl}/pending`);
  }

  approveUser(id: number): Observable<PendingUser> {
    return this.http.put<PendingUser>(`${this.apiUrl}/${id}/approve`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
