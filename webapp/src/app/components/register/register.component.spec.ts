import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// === Mock AuthService ===
class MockAuthService {
  register(name: string, email: string, password: string) {
    return of({ success: true });
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,        // Standalone
        RouterTestingModule,
        NoopAnimationsModule      // <── FIX PARA MAT-INPUT Y MAT-BUTTON
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  // ==== BASIC CREATION TEST ====
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ==== FORM STRUCTURE ====
  it('should have name, email, and password controls', () => {
    expect(component.registerForm.contains('name')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
  });

  it('should be invalid when form is empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  // ==== REGISTER LOGIC ====
  it('should call authService.register with correct values', () => {
    const spyRegister = spyOn(authService, 'register').and.callThrough();
    const spyNav = spyOn(component.router, 'navigateByUrl');

    component.registerForm.setValue({
      name: 'Juan Pérez',
      email: 'juan@test.com',
      password: '123456'
    });

    component.register();

    expect(spyRegister).toHaveBeenCalledWith(
      'Juan Pérez',
      'juan@test.com',
      '123456'
    );

    expect(spyNav).toHaveBeenCalledWith('/login');
  });
});
