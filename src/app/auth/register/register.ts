import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService, RegisterRequest } from '../../shared/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    if (
      !this.registerData.firstName ||
      !this.registerData.lastName ||
      !this.registerData.email ||
      !this.registerData.password
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.pending) {
          this.successMessage =
            "Votre compte a été créé et est en attente d'approbation par un administrateur.";
        } else {
          const role = response.role;
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard/admin']);
          } else if (role === 'FORMATEUR') {
            this.router.navigate(['/dashboard/formateur']);
          } else {
            this.router.navigate(['/dashboard/student']);
          }
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de l'inscription. Email déjà utilisé.";
      },
    });
  }
}
