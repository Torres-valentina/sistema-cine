import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('cine-app');

  constructor(private supabase: SupabaseService) {
    this.supabase.client.auth
      .getSession()
      .then((r) => console.log('Supabase OK', r));
  }
}