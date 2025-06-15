import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router : Router) {}

  onSubmit() {
    this.error = null;

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    
    this.auth.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse, datos vacíos o incorrectos';
      }
    });
  }
}
