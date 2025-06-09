import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Unauthorized');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  fetchUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user, {
      headers: this.getHeaders()
    });
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${user.id}`, user, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`, {
      headers: this.getHeaders()
    });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile`, {
      headers: this.getHeaders()
    });
  }

  updateProfile(profileUpdate: Partial<User> & { password?: string; newPassword?: string }): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/profile`, profileUpdate, {
      headers: this.getHeaders()
    });
  }

  deleteAccount(password: string): Observable<string> {
    return this.http.request<string>('delete', `${environment.apiUrl}/profile`, {
      headers: this.getHeaders(),
      body: { password },
      responseType: 'text' as 'json'
    });
  }
}