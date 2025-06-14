import { Component } from '@angular/core';
import { LogoComponent } from "../../shared/logo/logo.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  role: string | null = null;
  isLoggedIn = false;
  menuIcon:String = "☰"
  isMenuOpen = false;
  isDarkMode: boolean = false;

  private subscription: Subscription | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.subscription = this.authService.getRole().subscribe(role => {
      this.role = role;
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      const dark = localStorage.getItem('darkMode') === 'true';
      this.isDarkMode = dark;
      document.body.classList.toggle('dark', this.isDarkMode);
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isAdmin(): boolean {
    return this.role?.includes('ROLE_ADMIN') || false;
  }

  isManager(): boolean {
    return this.role?.includes('ROLE_MANAGER') || false;
  }


  isUser(): boolean {
    return this.role?.includes('ROLE_USER') || false;
  }

  darkmode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  
  desplegarMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuIcon = this.isMenuOpen ? "✕" : "☰";
  }
}
