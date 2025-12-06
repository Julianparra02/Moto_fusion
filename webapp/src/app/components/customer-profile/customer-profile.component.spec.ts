import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerProfileComponent } from './customer-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

// === MOCK AuthService ===
class MockAuthService {
  userName = 'Test User';
  userEmail = 'test@example.com';
  isLoggedIn = true;

  logout() {}
}

describe('CustomerProfileComponent', () => {
  let component: CustomerProfileComponent;
  let fixture: ComponentFixture<CustomerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerProfileComponent,  // Standalone
        RouterTestingModule,
        HttpClientTestingModule,   // 💥 FIX NullInjectorError
        NoopAnimationsModule       // 💥 FIX Angular Material animation errors
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
