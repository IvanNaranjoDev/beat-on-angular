import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { InstSound } from '../../models/InstSound';
import { Step } from '../../models/step';

@Injectable({
  providedIn: 'root'
})
export class InstSoundsService {
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

  fetchInstSounds(): Observable<InstSound[]> {
    return this.http.get<InstSound[]>(`${environment.apiUrl}/inst-sounds`, {
      headers: this.getHeaders(),
    });
  }

  getInstSoundById(id: number): Observable<InstSound> {
    return this.http.get<InstSound>(`${environment.apiUrl}/inst-sounds/${id}`, {
      headers: this.getHeaders()
    });
  }

  createInstSound(data: object): Observable<InstSound> {
    return this.http.post<InstSound>(`${environment.apiUrl}/inst-sounds`, data, {
      headers: this.getHeaders()
    });
  }

  updateInstSounds(instrumentalId: number, steps: Step[]): Observable<string> {
    return this.http.put<string>(`${environment.apiUrl}/inst-sounds/${instrumentalId}`, steps, {
      headers: this.getHeaders()
    });
  }

  deleteInstSound(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/inst-sounds/${id}`, {
      headers: this.getHeaders()
    });
  }

  getInstSoundsByInstrumentalId(instrumentalId: number): Observable<InstSound[]> {
    return this.http.get<InstSound[]>(`${environment.apiUrl}/inst-sounds/by-instrumental/${instrumentalId}`,
      { headers: this.getHeaders() }
    );
  }

  getSequencerSteps(instrumentalId: number): Observable<Step[]> {
  return this.http.get<Step[]>(`${environment.apiUrl}/inst-sounds/${instrumentalId}/steps`,
    { headers: this.getHeaders() }
  );
}
}
