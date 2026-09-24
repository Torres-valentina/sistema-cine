import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  cargando = signal(false);

  async entrar() {
    this.error.set('');
    this.cargando.set(true);
    const err = await this.auth.login(this.email, this.password);
    this.cargando.set(false);
    if (err) this.error.set(err);
    else this.router.navigate(['/']);
  }
}