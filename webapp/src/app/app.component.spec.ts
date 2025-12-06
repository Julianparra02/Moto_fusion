import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartService } from './services/cart.service';
import { CustomerService } from './services/customer.service';
import { AuthService } from './services/auth.service';

// ==== MOCK SERVICES ====
class MockAuthService {
  isLoggedIn = false;
}

class MockCartService {
  init() {}
}

class MockCustomerService {
  getNewProducts() { return of([]); }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let authService: MockAuthService;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,           // Standalone
        RouterTestingModule,
        NoopAnimationsModule    // Para Angular Material en Header/Footer
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CartService, useClass: MockCartService },
        { provide: CustomerService, useClass: MockCustomerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
  });

  // ==== COMPONENT CREATION ====
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ==== TITLE TEST ====
  it(`should have as title "webapp"`, () => {
    expect(component.title).toBe('webapp');
  });

  // ==== when NOT logged in ====
  it('should NOT call cartService.init() when user is NOT logged in', () => {
    authService.isLoggedIn = false;

    const spyInit = spyOn(cartService, 'init');

    component.ngOnInit();

    expect(spyInit).not.toHaveBeenCalled();
  });

  // ==== when IS logged in ====
  it('should call cartService.init() when user IS logged in', () => {
    authService.isLoggedIn = true;

    const spyInit = spyOn(cartService, 'init');

    component.ngOnInit();

    expect(spyInit).toHaveBeenCalled();
  });
});
