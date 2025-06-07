import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { Instrumental } from '../../models/instrumental';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-instrumentals',
  imports: [CommonModule],
  templateUrl: './my-instrumentals.component.html',
  styleUrl: './my-instrumentals.component.scss'
})
export class MyInstrumentalsComponent implements OnInit {
  MyInstrumentals: any[] = [];
  error: string | null = null;
  public environment = environment;

  constructor(
    private instrumentalService: InstrumentalService,
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef // Asegurar la inyección de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe({
      next: (userData) => {
        const userId = Number(userData.userId); // Extraer correctamente userId
        console.log('User ID procesado:', userId);

        this.instrumentalService.fetchInstrumentals().subscribe({
          next: (res: any[]) => {
            console.log('Instrumentales obtenidas:', res);
            
            this.MyInstrumentals = res.filter(i => Number(i.userId) === userId);
            console.log('Instrumentales después del filtrado:', this.MyInstrumentals);

            this.cdRef.detectChanges(); // Forzar actualización de la vista si es necesario
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error al obtener los instrumentales:', err);
            if (err.status === 403) {
              this.router.navigate(['/forbidden']);
            } else {
              this.error = 'Ha ocurrido un error al cargar los instrumentales.';
            }
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener User ID:', err);
        this.error = 'No se pudo obtener el usuario.';
      }
    });
  }

  togglePublic(inst: Instrumental): void {
    const updatedStatus = !inst.public;

    const dto = {
      id: inst.id,
      instName: inst.instName,
      bpm: inst.bpm,
      public: updatedStatus,
      userId: inst.userId,
      steps: inst.steps
    };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (inst.coverUrl) {
      formData.append('coverUrl', inst.coverUrl);
    }

    this.instrumentalService.updateInstrumental(inst.id, formData).subscribe({
      next: (updatedInst) => {
        inst.public = updatedInst.public;
        this.router.navigate(['/my-instrumentals']);
      },
      error: (err) => {
        console.error('Error actualizando visibilidad:', err);
      }
    });
  }
}
