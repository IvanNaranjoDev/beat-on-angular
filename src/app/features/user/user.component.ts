import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: any[] = [];
  error : String | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.fetchUsers().subscribe({
      next: (res: any) => (this.users = res),
      error: (err: HttpErrorResponse) => {
        if(err.status === 403){
          this.router.navigate(['/forbidden']);
        } else {
          this.error = 'An error ocurred'
        }
      },
    });
  }

  crearUsuario() {
    this.router.navigate(['/user-form', { mode: 'create' }]);
  }
  
  editarUsuario(id: number) {
    if (id) {
      this.router.navigate(['/user-form', { mode: 'edit', userId: id }]);
    } else {
      console.error('El ID es inválido');
    }
  }

  eliminarUsuario(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }
}
