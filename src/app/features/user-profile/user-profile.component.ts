import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../core/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Avatar } from '../../models/user';
import { AvatarService } from '../../core/services/avatar.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  usuario: User = {
    username: '',
    email: '',
    enabled: true,
    avatar: { id: 1, path: 'images/profile-1.png' },
    roles: []
  };

  avatars: Avatar[] = [];
  deleteMode: boolean = false;
  deletePassword: string = '';
  public environment = environment;

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarPerfil();
    });
  }

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarAvatars();
  }

  cargarPerfil(): void {
    this.userService.getProfile().subscribe({
      next: (data: User) => {
        this.usuario = {
          id: data.id,
          username: data.username || '',
          email: data.email || '',
          enabled: data.enabled ?? true,
          avatar: data.avatar || { id: 1, path: 'images/profile-1.png' },
          roles: data.roles || []
        };
      },
      error: err => {
        console.error('Error al cargar el perfil', err);
      }
    });
  }

  cargarAvatars(): void {
    this.avatarService.fetchAvatars().subscribe({
      next: (data: Avatar[]) => {
        this.avatars = data;
      },
      error: err => {
        console.error('Error al cargar avatars', err);
      }
    });
  }

  actualizarPerfil(): void {
    const avatarId = this.usuario.avatar?.id;
    const avatarObj = avatarId !== undefined && avatarId !== null
      ? { id: avatarId, path: this.usuario.avatar?.path }
      : undefined;

    const datosActualizados = {
      username: this.usuario.username,
      email: this.usuario.email,
      avatar: avatarObj
    };

    this.userService.updateProfile(datosActualizados).subscribe({
      next: (actualizado) => {
        // Opcional: actualizar usuario localmente si quieres antes del logout
        this.usuario = {
          ...this.usuario,
          username: actualizado.username || this.usuario.username,
          email: actualizado.email || this.usuario.email,
          avatar: actualizado.avatar || this.usuario.avatar,
          roles: actualizado.roles || this.usuario.roles,
          enabled: actualizado.enabled ?? this.usuario.enabled
        };

        // Hacer logout para limpiar token y redirigir a login
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Error al actualizar perfil', err);
      }
    });
  }

  eliminarCuenta(): void {
    if (!this.deletePassword) {
      alert('Introduce tu contraseña para confirmar.');
      return;
    }

    this.userService.deleteAccount(this.deletePassword).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => {
      }
    });
  }
}
