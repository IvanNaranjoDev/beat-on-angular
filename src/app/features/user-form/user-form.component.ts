import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  usuario: User = {
    username: '',
    email: '',
    password: '', // Solo se usa en modo 'create'
    enabled: true,
    avatar: { id: 1, path: 'images/profile-1.png' }, // Avatar predeterminado
    roles: [{ id: 3, name: 'ROLE_USER' }],
  };
  mode: string = 'create';
  userId: string | null = null;
  rolesDisponibles = environment.roles;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode') || 'create';
    this.userId = this.route.snapshot.paramMap.get('userId');

    if (this.mode === 'edit' && this.userId) {
      this.cargarUsuario();
    }
  }

  cargarUsuario() {
    if (this.userId) {
      this.userService.getUserById(Number(this.userId)).subscribe((data: User) => {
        this.usuario = {
          username: data.username,
          email: data.email,
          enabled: data.enabled,
          avatar: data.avatar,
          roles: data.roles,
        };
      });
    }
  }

  guardarUsuario() {
    if (this.mode === 'create') {
      this.userService.createUser(this.usuario).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else if (this.mode === 'edit' && this.userId) {
      this.usuario.id = Number(this.userId);
  
      // ⚠️ Asegurarse de eliminar `password` antes de enviar la solicitud
      delete this.usuario.password;
  
      this.userService.updateUser(this.usuario).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }  
}