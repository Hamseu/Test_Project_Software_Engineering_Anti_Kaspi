import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CatalogService } from '../services/catalog.service';

@Component({
  selector: 'app-navigation-panel',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-panel.html',
  styleUrl: './navigation-panel.css',
})
export class NavigationPanel {
  categories = signal<{ name: string }[]>([]);
  error = signal(false);

  constructor() {
    inject(CatalogService).categories().pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe({
      next: categories => this.categories.set(categories),
      error: () => this.error.set(true),
    });
  }
}
