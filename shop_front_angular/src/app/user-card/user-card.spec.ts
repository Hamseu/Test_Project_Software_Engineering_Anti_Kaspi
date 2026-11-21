import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCard } from './user-card';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', { id: '1', label: 'Phone', description: 'Test', price: 100, link: 'https://example.com/?a=1&b=2', rating: null, imageUrl: '' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('increments likes and displays unavailable ratings', async () => {
    fixture.nativeElement.querySelector('[aria-label="Like the product"]').click();
    await fixture.whenStable();
    expect(component.likeCount).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Rating unavailable');
  });

  it('encodes the WhatsApp share text', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.Wshare();
    expect(open).toHaveBeenCalledWith('https://wa.me/?text=Check%20out%20this%20product%3A%20https%3A%2F%2Fexample.com%2F%3Fa%3D1%26b%3D2', '_blank');
    open.mockRestore();
  });

  it('emits removal only after confirmation', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    const emit = vi.spyOn(component.deleteID, 'emit');
    component.removeItem();
    expect(emit).not.toHaveBeenCalled();
    component.removeItem();
    expect(emit).toHaveBeenCalledWith('1');
    confirm.mockRestore();
  });

  it('switches to the fallback image only once', () => {
    const image = document.createElement('img');
    component.onImageError({ target: image } as unknown as Event);
    expect(image.src).toContain('/Defaultim.png');
    component.onImageError({ target: image } as unknown as Event);
    expect(image.getAttribute('src')).toBe('/Defaultim.png');
  });
});
