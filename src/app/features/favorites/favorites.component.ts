import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Instrumental } from '../../models/instrumental';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { Like } from '../../models/Like';
import { LikeService } from '../../core/services/like.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favorites: Instrumental[] = [];
  likes: Like[] = [];
  loading = true;
  error = '';
  public environment = environment;

  constructor(
    private likeService: LikeService,
    private instrumentalService: InstrumentalService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const { userId } = await firstValueFrom(this.authService.getUserId());

      this.likeService.getLikesByUserId(userId).subscribe({
        next: (likes: Like[]) => {
          this.likes = likes;
          const instrumentalIds = likes.map(like => like.instrumentalId);

          instrumentalIds.forEach(id => {
            this.instrumentalService.getInstrumentalById(id).subscribe({
              next: (instrumental) => {
                this.favorites.push(instrumental);
              },
              error: () => {
                console.error(`No se pudo cargar la instrumental con ID ${id}`);
              }
            });
          });

          this.loading = false;
        },
        error: () => {
          this.error = 'Error al cargar favoritos';
          this.loading = false;
        }
      });
    } catch (error) {
      this.error = 'Error al obtener ID de usuario';
      this.loading = false;
      console.error(error);
    }
  }

  async removeFromFavorites(instId: number): Promise<void> {
    try {
      const { userId } = await firstValueFrom(this.authService.getUserId());

      const likeToDelete = this.likes.find(like => like.instrumentalId === instId && like.userId === userId);

      if (likeToDelete) {
        this.likeService.deleteLike(likeToDelete.id).subscribe({
          next: () => {
            this.favorites = this.favorites.filter(inst => inst.id !== instId);
            this.likes = this.likes.filter(like => like.id !== likeToDelete.id);
          },
          error: err => {
            console.error('Error al eliminar el like:', err);
          }
        });
      }
    } catch (error) {
      console.error('Error al obtener userId:', error);
    }
  }
}