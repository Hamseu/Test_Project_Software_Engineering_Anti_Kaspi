import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationPanel } from './navigation-panel';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('NavigationPanel', () => {
  let component: NavigationPanel;
  let fixture: ComponentFixture<NavigationPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationPanel],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationPanel);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController).expectOne('/api/categories/').flush([{ name: 'Phones' }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Phones');
  });
});
