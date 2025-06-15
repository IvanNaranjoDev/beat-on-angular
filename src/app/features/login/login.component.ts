import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  showPassword: boolean = false;

  constructor(private auth: AuthService, private router : Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: res => {    
        this.auth.setToken(res.token);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.error = 'Usuario y contraseña invalidos';
      },
    });
  }
}