import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../shared/services/auth';
import { FooterComponent } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loginData: LoginRequest = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.role === 'ADMIN') this.router.navigate(['/admin']);
        else if (response.role === 'FORMATEUR') this.router.navigate(['/dashboard/formateur']);
        else this.router.navigate(['/dashboard/student']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
      },
    });
  }
}
