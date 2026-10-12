import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>E-Learning</h3>
          <p>La plateforme d'apprentissage en ligne</p>
        </div>
        <div class="footer-links">
          <h4>Navigation</h4>
          <a href="/courses">Catalogue</a>
          <a href="/login">Connexion</a>
          <a href="/register">S'inscrire</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>2026 ArabSoft</p>
      </div>
    </footer>
  `,
  styleUrl: './footer.scss',
})
export class FooterComponent {}
