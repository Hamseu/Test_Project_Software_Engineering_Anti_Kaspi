import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Product } from '../models/product.model';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  link: string;
  rating: string | null;
  image_url: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);

  categories() {
    return this.http.get<{ name: string }[]>('/api/categories/');
  }

  products(category: string) {
    return this.http.get<ApiProduct[]>(`/api/categories/${encodeURIComponent(category)}/products/`).pipe(
      map(products => products.map((product): Product => ({
        id: String(product.id),
        label: product.name,
        description: product.description,
        price: Number(product.price),
        link: product.link,
        rating: product.rating === null ? null : Number(product.rating),
        imageUrl: product.image_url,
      }))),
    );
  }
}
