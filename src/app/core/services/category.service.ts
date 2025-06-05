  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { AuthService } from './auth.service';
  import { Observable } from 'rxjs';
  import { environment } from '../../../environments/environment';
  import { Category } from '../../models/category';

  @Injectable({
    providedIn: 'root'
  })
  export class CategoryService {

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

    fetchCategories(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/categories`, {
        headers: this.getHeaders(),
      });
    }

    getCategoryById(id: number): Observable<Category> {
      return this.http.get<Category>(`${environment.apiUrl}/categories/${id}`, {
        headers: this.getHeaders()
      });
    }

    createCategory(formData: FormData): Observable<Category> {
      return this.http.post<Category>(`${environment.apiUrl}/categories`, formData, {
        headers: this.getFormDataHeaders()
      });
    }
    
    updateCategory(id: number, formData: FormData): Observable<Category> {
      return this.http.put<Category>(`${environment.apiUrl}/categories/${id}`, formData, {
        headers: this.getFormDataHeaders()
      });
    }
    
    deleteCategory(id: number): Observable<void> {
      return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`, {
        headers: this.getHeaders()
      });
    }

    getCategoriesSequencer(): Observable<any> {
      return this.http.get(`${environment.apiUrl}/sequencer/categories`, {
        headers: this.getHeaders(),
      });
    }
  }
