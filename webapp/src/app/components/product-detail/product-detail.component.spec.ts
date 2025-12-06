import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';

// ===== MOCKS =====

class MockCustomerService {
  getProductById(id: string) {
    return of({
      _id: id,
      name: 'Producto Test',
      price: 200,
      images: ['img.jpg'],
      description: '',
      reference: '',
      categoryId: '',
      brandId: '',
      compatibilidad: [],
      isFeatured: false,
      isNewProduct: false,
      marca: '',
      modelo: '',
      year: 2022
    });
  }
}

class MockCartService {
  items: any[] = [];

  addToCart(id: string, qty: number) {
    return of({});
  }

  removeFromCart(id: string) {
    return of({});
  }

  init() {}
}

describe('ProductDetailComponent', () => {

  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: CartService, useClass: MockCartService },

        // 🔥 FIX TOTAL: mock correcto para snapshot.paramMap
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '123'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);

    fixture.detectChanges(); // ejecuta ngOnInit()
  });

  // ============================================================
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  it('should load product when ID is present', () => {
    expect(component.product?._id).toBe('123');
    expect(component.loading).toBeFalse();
  });

  // ============================================================
  it('should set error when ID is missing', async () => {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: CartService, useClass: MockCartService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    const fix2 = TestBed.createComponent(ProductDetailComponent);
    const comp2 = fix2.componentInstance;
    fix2.detectChanges();

    expect(comp2.error).toBe('Producto no encontrado');
    expect(comp2.loading).toBeFalse();
  });

  // ============================================================
  it('should handle error from service', () => {
    const service = TestBed.inject(CustomerService) as any;
    spyOn(service, 'getProductById').and.returnValue(throwError(() => new Error()));

    component.ngOnInit();

    expect(component.error).toBe('No se pudo cargar el producto.');
  });

  // ============================================================
  it('should return false if product is NOT in cart', () => {
    cartService.items = [];
    expect(component.isProductInCart('999')).toBeFalse();
  });

  // ============================================================
  it('should return true if product IS in cart', () => {
    cartService.items = [{ product: { _id: '123' } }];
    expect(component.isProductInCart('123')).toBeTrue();
  });

  // ============================================================
  it('should call addToCart when product is NOT in cart', () => {
    const spy = spyOn(cartService, 'addToCart').and.callThrough();
    component.product = { _id: '111' } as Product;

    component.addToCart(component.product);

    expect(spy).toHaveBeenCalledWith('111', 1);
  });

  // ============================================================
  it('should call removeFromCart when product IS already in cart', () => {
    cartService.items = [{ product: { _id: '123' } }];
    const spy = spyOn(cartService, 'removeFromCart').and.callThrough();

    component.product = { _id: '123' } as Product;

    component.addToCart(component.product);

    expect(spy).toHaveBeenCalledWith('123');
  });

});
