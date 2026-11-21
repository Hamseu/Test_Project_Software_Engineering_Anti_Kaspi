import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CatalogService } from '../services/catalog.service';
import { Product } from '../models/product.model';
import { UserCard } from '../user-card/user-card';

@Component({
  selector: 'product-list',
  imports: [UserCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private catalog = inject(CatalogService);
  private destroyRef = inject(DestroyRef);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal(false);
  private removed = new Set<string>();

  constructor() {
    inject(ActivatedRoute).paramMap.pipe(
      tap(() => { this.loading.set(true); this.error.set(false); }),
      switchMap(params => this.catalog.products(params.get('category') ?? '').pipe(
        catchError(() => { this.error.set(true); return of([]); }),
      )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(products => {
      this.products.set(products.filter(product => !this.removed.has(product.id)));
      this.loading.set(false);
    });
  }

  itemDelete(id: string) {
    this.removed.add(id);
    this.products.update(products => products.filter(product => product.id !== id));
  }
}
