import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../core/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

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

  deleteMode: boolean = false;
  deletePassword: string = '';

  constructor(
    private userService: UserService,
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

  actualizarPerfil(): void {
    const datosActualizados = {
      username: this.usuario.username,
      email: this.usuario.email
    };

    this.userService.updateProfile(datosActualizados).subscribe({
      next: (actualizado) => {
        this.usuario = {
          ...this.usuario,
          username: actualizado.username || this.usuario.username,
          email: actualizado.email || this.usuario.email,
          avatar: actualizado.avatar || this.usuario.avatar,
          roles: actualizado.roles || this.usuario.roles,
          enabled: actualizado.enabled ?? this.usuario.enabled
        };
        this.router.navigate(['/profile']);
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
