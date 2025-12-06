import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

// Mock CustomerService (agregamos getCategories aunque no exista en el real)
class MockCustomerService {
  getCategories() {
    return of([
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ]);
  }
}

// Mock AuthService
class MockAuthService {
  logout() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,        // standalone component
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
