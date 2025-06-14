import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { EmailService } from '../../core/services/email.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-email-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss'
})
export class EmailFormComponent implements OnInit {
   usuarios: Array<{ email: string }> = [];
  subjects: string[] = [
    'Modificación de cuenta',
    'Eliminación de cuenta',
    'Recuperación de cuenta',
  ];

  email = {
    to: '',
    subject: '',
    text: ''
  };

  constructor(private userService: UserService, private emailService: EmailService, private http: HttpClient) {}

  ngOnInit() {
    this.userService.fetchUsers().subscribe((data) => {
      this.usuarios = data;
    });
  }

  enviarEmail() {
    this.emailService.postMail(this.email).subscribe({
      next: (response) => {
        console.log('Correo enviado correctamente', response);
      },
      error: (error) => {
        console.error('Error al enviar el correo', error);
      }
    });
  }
}
