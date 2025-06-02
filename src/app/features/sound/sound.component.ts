import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoundService } from '../../core/services/sound.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sound.component.html',
  styleUrl: './sound.component.scss'
})
export class SoundComponent implements OnInit {
  sounds: any[] = [];
  error: string | null = null;
  public environment = environment;

  constructor(private soundService: SoundService, private router: Router) {}

  ngOnInit() {
    this.soundService.fetchSounds().subscribe({
      next: (res: any) => (this.sounds = res),
      error: (err: HttpErrorResponse) => {
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        } else {
          this.error = 'Ocurrió un error al cargar los sonidos.';
        }
      },
    });
  }

  crearSonido() {
    this.router.navigate(['/sound-form', { mode: 'create' }]);
  }

  editarSonido(id: number) {
    if (id) {
      this.router.navigate(['/sound-form', { mode: 'edit', soundId: id }]);
    } else {
      console.error('ID inválido');
    }
  }

  eliminarSonido(id: number): void {
    this.soundService.deleteSound(id).subscribe(() => {
      this.sounds = this.sounds.filter(sound => sound.id !== id);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}
