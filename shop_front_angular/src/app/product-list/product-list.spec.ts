import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductList } from './product-list';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ category: 'Phones' })) } }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    TestBed.inject(HttpTestingController).expectOne('/api/categories/Phones/products/').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No products');
  });

  it('shows an error when the API fails', () => {
    TestBed.inject(HttpTestingController).expectOne('/api/categories/Phones/products/').flush('error', { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to load products');
  });

  it('maps products and removes them locally', () => {
    TestBed.inject(HttpTestingController).expectOne('/api/categories/Phones/products/').flush([
      { id: 1, name: 'Phone', description: 'Test', price: '100.00', link: 'https://example.com', rating: null, image_url: '' },
    ]);
    expect(component.products()[0].price).toBe(100);
    expect(component.products()[0].rating).toBeNull();
    component.itemDelete('1');
    expect(component.products()).toEqual([]);
  });
});
