import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Sound } from '../../models/sound';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  fetchSounds(): Observable<Sound[]> {
    return this.http.get<Sound[]>(`${environment.apiUrl}/sounds`, {
      headers: this.getHeaders(),
    });
  }

  getSoundById(id: number): Observable<Sound> {
    return this.http.get<Sound>(`${environment.apiUrl}/sounds/${id}`, {
      headers: this.getHeaders()
    });
  }

  createSound(formData: FormData): Observable<Sound> {
    return this.http.post<Sound>(`${environment.apiUrl}/sounds`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  updateSound(id: number, formData: FormData): Observable<Sound> {
    return this.http.put<Sound>(`${environment.apiUrl}/sounds/${id}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  deleteSound(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/sounds/${id}`, {
      headers: this.getHeaders()
    });
  }

  getSequencerSounds(): Observable<Sound[]> {
  return this.http.get<Sound[]>(`${environment.apiUrl}/sequencer`, {
    headers: this.getHeaders()
  });
  }
}
