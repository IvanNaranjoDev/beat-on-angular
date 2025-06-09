import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateLike, Like } from '../../models/Like';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

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

  fetchLikes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/likes`, {
      headers: this.getHeaders(),
    });
  }
  
  getLikeById(id: number): Observable<Like> {
    return this.http.get<Like>(`${environment.apiUrl}/likes/${id}`, {
      headers: this.getHeaders()
    });
  }

  getLikesByUserId(userId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/likes/by-user/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  createLike(createLike: CreateLike): Observable<Like> {
    return this.http.post<Like>(`${environment.apiUrl}/likes`, createLike, {
      headers: this.getHeaders()
    });
  }

  deleteLike(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/likes/${id}`, {
      headers: this.getHeaders()
    });
  }
}
