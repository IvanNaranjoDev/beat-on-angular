import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category';
import { Instrumental } from '../../models/instrumental';

@Injectable({
  providedIn: 'root'
})
export class InstrumentalService {

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

  private getFormDataHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Unauthorized');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  fetchInstrumentals(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/instrumentals`, {
      headers: this.getHeaders(),
    });
  }

  getInstrumentalById(id: number): Observable<Instrumental> {
    return this.http.get<Instrumental>(`${environment.apiUrl}/instrumentals/${id}`, {
      headers: this.getHeaders()
    });
  }

  createInstrumental(formData: FormData): Observable<Instrumental> {
    return this.http.post<Instrumental>(`${environment.apiUrl}/instrumentals`, formData, {
      headers: this.getFormDataHeaders()
    });
  }
    
  updateInstrumental(id: number, formData: FormData): Observable<Instrumental> {
    return this.http.put<Instrumental>(`${environment.apiUrl}/instrumentals/${id}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }
    
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/instrumentals/${id}`, {
      headers: this.getHeaders()
    });
  }
}
