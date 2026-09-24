import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  error = signal('');
  cargando = signal(false);

  async registrar() {
    this.error.set('');
    if (this.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    this.cargando.set(true);
    const err = await this.auth.registrar(this.nombre, this.email, this.password);
    if (!err) await this.auth.login(this.email, this.password);
    this.cargando.set(false);
    if (err) this.error.set(err);
    else this.router.navigate(['/']);
  }
}
