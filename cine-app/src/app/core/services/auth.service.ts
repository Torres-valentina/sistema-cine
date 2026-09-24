import { Injectable, computed, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export type Rol = 'cliente' | 'personal' | 'admin';

export interface Perfil {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  credito: number;
  puntos: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _session = signal<Session | null>(null);
  private readonly _perfil = signal<Perfil | null>(null);

  readonly perfil = this._perfil.asReadonly();
  readonly logueado = computed(() => !!this._session());
  readonly rol = computed(() => this._perfil()?.rol ?? null);
  /** Se resuelve cuando ya se conoce el estado de la sesión (lo usan los guards) */
  readonly listo: Promise<void>;

  constructor(private sb: SupabaseService) {
    this.listo = this.iniciar();
    this.sb.client.auth.onAuthStateChange((_evento, session) => {
      this._session.set(session);
      // setTimeout evita un deadlock conocido de supabase-js al llamar a la API dentro del callback
      setTimeout(() => this.cargarPerfil(session));
    });
  }

  private async iniciar() {
    const { data } = await this.sb.client.auth.getSession();
    this._session.set(data.session);
    await this.cargarPerfil(data.session);
  }

  private async cargarPerfil(session: Session | null) {
    if (!session) {
      this._perfil.set(null);
      return;
    }
    const { data } = await this.sb.client
      .from('perfiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    this._perfil.set(data as Perfil | null);
  }

  /** Devuelve un mensaje de error, o null si salió bien */
  async login(email: string, password: string): Promise<string | null> {
    const { data, error } = await this.sb.client.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    this._session.set(data.session);
    await this.cargarPerfil(data.session);
    return null;
  }

  async registrar(nombre: string, email: string, password: string): Promise<string | null> {
    const { error } = await this.sb.client.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    return error ? error.message : null;
  }

  async logout() {
    await this.sb.client.auth.signOut();
    this._session.set(null);
    this._perfil.set(null);
  }
}