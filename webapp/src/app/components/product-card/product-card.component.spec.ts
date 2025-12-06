import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

// ===== MOCK DEL CART SERVICE =====
class MockCartService {
  items: any[] = [];

  addToCart(productId: string, qty: number) {
    return of({ success: true });
  }

  removeFromCart(productId: string) {
    return of({ success: true });
  }

  init() {}
}

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartService: MockCartService;

  const mockProduct = {
    _id: '123',
    name: 'Producto Test',
    price: 100
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductCardComponent,   // Standalone component
        RouterTestingModule
      ],
      providers: [
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as any;

    component.product = mockProduct; // asignar input
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // =========== isProductInCart TESTS ===========
  it('should return false if product is not in cart', () => {
    cartService.items = []; // carrito vacío

    const result = component.isProductInCart('123');

    expect(result).toBeFalse();
  });

  it('should return true if product is in cart', () => {
    cartService.items = [
      { product: { _id: '123', name: 'Producto Test' } }
    ];

    const result = component.isProductInCart('123');

    expect(result).toBeTrue();
  });

  // =========== addToCart TESTS ===========
  it('should call addToCart when product is not in cart', () => {
    cartService.items = [];  // NO está en el carrito

    const spyAdd = spyOn(cartService, 'addToCart').and.callThrough();
    const spyInit = spyOn(cartService, 'init');

    component.addToCart(mockProduct);

    expect(spyAdd).toHaveBeenCalledWith('123', 1);
    expect(spyInit).toHaveBeenCalled();
  });

  it('should call removeFromCart when product IS in cart', () => {
    cartService.items = [
      { product: { _id: '123' } }  // Sí está en el carrito
    ];

    const spyRemove = spyOn(cartService, 'removeFromCart').and.callThrough();
    const spyInit = spyOn(cartService, 'init');

    component.addToCart(mockProduct);

    expect(spyRemove).toHaveBeenCalledWith('123');
    expect(spyInit).toHaveBeenCalled();
  });

});
