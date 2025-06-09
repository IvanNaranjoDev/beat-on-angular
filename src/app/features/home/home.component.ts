import { Component, OnInit } from '@angular/core';
import { Instrumental } from '../../models/instrumental';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Like } from '../../models/Like';
import { LikeService } from '../../core/services/like.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
}) 
export class HomeComponent implements OnInit {
  publicInstrumentals: Instrumental[] = [];
  likes: Like[] = [];
  favorites: Instrumental[] = [];
  public environment = environment;

  constructor(
    private instrumentalService: InstrumentalService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.instrumentalService.fetchPublicInstrumentals().subscribe((data) => {
      this.publicInstrumentals = data.filter((inst: Instrumental) => inst.public);
    });
  }

  async addToFavorites(instId: number): Promise<void> {
    try {
      const { userId } = await firstValueFrom(this.authService.getUserId());

      // Verifica si ya existe el like para evitar duplicados
      const exists = this.likes.some(like => like.instrumentalId === instId && like.userId === userId);
      if (exists) {
        return; // Ya está en favoritos, no hace falta agregar
      }

      const like = {
        userId: userId,
        instrumentalId: instId
      };

      this.likeService.createLike(like).subscribe({
        next: (createdLike) => {
          const instrumental = this.publicInstrumentals.find(inst => inst.id === instId);
          if (instrumental) {
            this.favorites.push(instrumental);
          }
          this.likes.push(createdLike);
        },
        error: (err) => {
          console.error('Error al añadir a favoritos:', err);
        }
      });

    } catch (error) {
      console.error('Error al obtener userId:', error);
    }
  }

  isFavorite(instId: number): boolean {
    return this.likes.some(like => like.instrumentalId === instId);
  }
}
