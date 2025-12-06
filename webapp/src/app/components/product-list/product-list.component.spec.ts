import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// === MOCK SERVICES ===
class MockCustomerService {
  getCategories() {
    return of([]);
  }
  getBrands() {
    return of([]);
  }
  getProducts() {
    return of([]);
  }
}

class MockCartService {
  items = [];
  addToCart() { return of({}); }
  removeFromCart() { return of({}); }
  init() {}
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule   // 💥 FIX NG05105
      ],
      providers: [
        { provide: MockCustomerService, useClass: MockCustomerService },
        { provide: MockCartService, useClass: MockCartService },

        // Angular injecta CustomerService → por eso usamos useClass
        { provide: 'CustomerService', useExisting: MockCustomerService },
        { provide: 'CartService', useExisting: MockCartService },

        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ search: 'test', categoryId: '1' })
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
