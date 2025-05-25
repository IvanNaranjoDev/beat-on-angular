import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private role = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/v1/auth/authenticate`,
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      map(response => {
        this.setToken(response.token);
        return response;
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  setToken(token: string): void {
    if (!token || token.split('.').length !== 3) return; // Validación básica
    this.token.next(token);
    this.role.next(this.extractRoleFromToken(token));
  }

  getToken(): string | null {
    return this.token.value;
  }

  isLoggedIn(): Observable<boolean> {
    return this.token.asObservable().pipe(map(token => !!token));
  }

  private extractRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }

  getRole(): Observable<string | null> {
    return this.role.asObservable();
  }

  register(userData: { username: string, email: string, password: string }) {
  return this.http.post(`${environment.apiUrl}/register`, userData);
  }

  logout(): void {
    this.token.next(null);
    this.role.next(null);
    this.router.navigate(['/']);
  }
}